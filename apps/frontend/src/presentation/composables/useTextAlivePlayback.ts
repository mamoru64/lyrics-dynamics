import { onBeforeUnmount, ref } from "vue";
import { GetTextAliveToken } from "../../application/usecases/GetTextAliveToken";
import type { TextAlivePlaybackRepository, TimedChar } from "../../domain/repositories/TextAlivePlaybackRepository";
import { EnvTextAliveTokenRepository } from "../../infrastructure/config/EnvTextAliveTokenRepository";
import { TextAlivePlaybackApiRepository } from "../../infrastructure/textalive/TextAlivePlaybackApiRepository";

const DISPLAY_LEAD_MS = 60;

const tokenUsecase = new GetTextAliveToken(new EnvTextAliveTokenRepository());

export const useTextAlivePlayback = () => {
    const playbackRepository: TextAlivePlaybackRepository = new TextAlivePlaybackApiRepository();
    const repositoryReady = ref(false);
    const listenersBound = ref(false);
    const mediaMountElement = ref<HTMLElement | null>(null);

    const textAliveLoading = ref(false);
    const textAliveReady = ref(false);
    const textAliveError = ref("");
    const currentLyric = ref("");
    const isPlaying = ref(false);
    const playheadPosition = ref(0);
    const firstCharStartTime = ref(-1);
    const volume = ref(100);
    const isMuted = ref(false);
    let previousVolumeBeforeMute = 100;

    let animationFrameId: number | null = null;
    let lastCharStartTime = -1;
    let lastEventPosition = 0;
    let lastEventTimestamp = 0;
    const timedChars = ref<TimedChar[]>([]);
    let timedCharIndex = 0;

    const markEventPosition = (position: number) => {
        lastEventPosition = position;
        lastEventTimestamp = performance.now();
        playheadPosition.value = position;
    };

    const applyTimedChars = (list: TimedChar[]) => {
        timedChars.value = list;
        timedCharIndex = 0;
        firstCharStartTime.value = list[0]?.startTime ?? -1;
    };

    const updateLyricIfAvailable = (position: number): void => {
        const adjustedPosition = position + DISPLAY_LEAD_MS;
        playheadPosition.value = adjustedPosition;

        const list = timedChars.value;
        if (list.length === 0) return;

        if (timedCharIndex >= list.length) {
            timedCharIndex = list.length - 1;
        }

        while (timedCharIndex + 1 < list.length && list[timedCharIndex + 1].startTime <= adjustedPosition) {
            timedCharIndex += 1;
        }

        while (timedCharIndex > 0 && list[timedCharIndex].startTime > adjustedPosition) {
            timedCharIndex -= 1;
        }

        const item = list[timedCharIndex];
        if (!item) return;
        if (adjustedPosition < item.startTime) return;

        if (lastCharStartTime !== item.startTime || currentLyric.value !== item.text) {
            currentLyric.value = item.text;
            lastCharStartTime = item.startTime;
        }
    };

    const getCurrentKnownPosition = (): number => {
        return Math.max(playbackRepository.getVideoPosition(), playbackRepository.getMediaPosition(), lastEventPosition);
    };

    const getSynchronizedPosition = (): number => {
        if (!isPlaying.value) {
            return getCurrentKnownPosition();
        }

        if (lastEventTimestamp > 0) {
            const elapsed = Math.max(0, performance.now() - lastEventTimestamp);
            return lastEventPosition + elapsed;
        }

        return getCurrentKnownPosition();
    };

    const stopPlaybackTicker = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    const startPlaybackTicker = () => {
        stopPlaybackTicker();

        const tick = () => {
            if (!isPlaying.value) return;
            const position = getSynchronizedPosition();
            updateLyricIfAvailable(position);
            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);
    };

    const bindRepositoryListeners = () => {
        if (listenersBound.value) return;

        playbackRepository.addListener({
            onVideoReady: () => {
                currentLyric.value = "";
                lastCharStartTime = -1;
                playheadPosition.value = 0;
                lastEventPosition = 0;
                lastEventTimestamp = 0;
            },
            onTimeUpdate: (position: number) => {
                markEventPosition(position);
                updateLyricIfAvailable(position);
            },
            onThrottledTimeUpdate: (position: number) => {
                markEventPosition(position);
                updateLyricIfAvailable(position);
            },
            onPlay: () => {
                isPlaying.value = true;
                markEventPosition(Math.max(getCurrentKnownPosition(), playheadPosition.value));
                startPlaybackTicker();
                updateLyricIfAvailable(getSynchronizedPosition());
            },
            onPause: () => {
                isPlaying.value = false;
                stopPlaybackTicker();
            },
            onStop: () => {
                isPlaying.value = false;
                stopPlaybackTicker();
            },
            onVolumeUpdate: (nextVolume: number) => {
                volume.value = nextVolume;
                isMuted.value = nextVolume <= 0;
            },
        });

        listenersBound.value = true;
    };

    const ensureRepository = async () => {
        if (repositoryReady.value) return;
        const token = await tokenUsecase.execute();
        playbackRepository.initialize({ token, mediaElement: mediaMountElement.value ?? undefined });
        bindRepositoryListeners();
        playbackRepository.setVolume(volume.value);
        repositoryReady.value = true;
    };

    const loadSong = async (songUrl: string, options?: { lyricsUrl?: string; songTitle?: string }) => {
        stopPlaybackTicker();
        isPlaying.value = false;
        textAliveLoading.value = true;
        textAliveReady.value = false;
        textAliveError.value = "";

        try {
            await ensureRepository();
            const list = await playbackRepository.loadSong(songUrl, {
                lyricsUrl: options?.lyricsUrl,
            });
            applyTimedChars(list);

            currentLyric.value = "";
            lastCharStartTime = -1;
            playheadPosition.value = 0;
            lastEventPosition = 0;
            lastEventTimestamp = 0;
            textAliveReady.value = true;

            if (timedChars.value.length === 0) {
                const title = options?.songTitle ? `「${options.songTitle}」` : "この楽曲";
                textAliveError.value = `${title} は現在 TextAlive 側で歌詞タイミング情報が取得できないため、歌詞同期表示は行えません。`;
            }
        } catch (error) {
            textAliveError.value = error instanceof Error ? error.message : "TextAlive Player の初期化に失敗しました";
        } finally {
            textAliveLoading.value = false;
        }
    };

    const play = () => {
        if (!repositoryReady.value) return;
        isPlaying.value = true;
        markEventPosition(Math.max(getCurrentKnownPosition(), playheadPosition.value));
        startPlaybackTicker();
        updateLyricIfAvailable(getSynchronizedPosition());
        playbackRepository.requestPlay();
    };

    const pause = () => {
        isPlaying.value = false;
        stopPlaybackTicker();
        if (!repositoryReady.value) return;
        playbackRepository.requestPause();
    };

    const setMediaMount = (element: HTMLElement) => {
        mediaMountElement.value = element;
        playbackRepository.setMediaElement(element);
    };

    const setVolume = (nextVolume: number) => {
        const clamped = Math.min(100, Math.max(0, Math.round(nextVolume)));
        volume.value = clamped;
        isMuted.value = clamped <= 0;
        if (repositoryReady.value) {
            playbackRepository.setVolume(clamped);
        }
    };

    const volumeUp = () => {
        setVolume(volume.value + 10);
    };

    const volumeDown = () => {
        setVolume(volume.value - 10);
    };

    const toggleMute = () => {
        if (isMuted.value || volume.value <= 0) {
            const restore = previousVolumeBeforeMute > 0 ? previousVolumeBeforeMute : 60;
            setVolume(restore);
            return;
        }

        previousVolumeBeforeMute = volume.value;
        setVolume(0);
    };

    onBeforeUnmount(() => {
        stopPlaybackTicker();
    });

    return {
        textAliveLoading,
        textAliveReady,
        textAliveError,
        currentLyric,
        isPlaying,
        playheadPosition,
        firstCharStartTime,
        volume,
        isMuted,
        setMediaMount,
        loadSong,
        play,
        pause,
        setVolume,
        volumeUp,
        volumeDown,
        toggleMute,
    };
};