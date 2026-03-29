import { onBeforeUnmount, ref } from "vue";
import { createTextAlivePlayer } from "../../infrastructure/textalive/player";
import { fetchTextAliveToken } from "../../infrastructure/api/TextAliveApi";

type TimedChar = {
    text: string;
    startTime: number;
    endTime: number;
};

export const useTextAlivePlayback = () => {
    const player = ref<ReturnType<typeof createTextAlivePlayer> | null>(null);
    const mediaMountElement = ref<HTMLElement | null>(null);

    const textAliveLoading = ref(false);
    const textAliveReady = ref(false);
    const textAliveError = ref("");
    const currentLyric = ref("");
    const isPlaying = ref(false);
    const playheadPosition = ref(0);
    const firstCharStartTime = ref(-1);

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

    const rebuildTimedChars = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
        const list: TimedChar[] = [];
        let charNode = textAlivePlayer.video?.firstChar ?? null;

        while (charNode) {
            list.push({
                text: charNode.text,
                startTime: charNode.startTime,
                endTime: charNode.endTime,
            });
            charNode = charNode.next;
        }

        timedChars.value = list;
        timedCharIndex = 0;
        firstCharStartTime.value = list[0]?.startTime ?? -1;
    };

    const updateLyricIfAvailable = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>, position: number): void => {
        if (!textAlivePlayer.video) return;
        playheadPosition.value = position;

        const list = timedChars.value;
        if (list.length === 0) return;

        if (timedCharIndex >= list.length) {
            timedCharIndex = list.length - 1;
        }

        while (timedCharIndex + 1 < list.length && list[timedCharIndex + 1].startTime <= position) {
            timedCharIndex += 1;
        }

        while (timedCharIndex > 0 && list[timedCharIndex].startTime > position) {
            timedCharIndex -= 1;
        }

        const item = list[timedCharIndex];
        if (!item) return;
        if (position < item.startTime || position > item.endTime) return;

        if (lastCharStartTime !== item.startTime || currentLyric.value !== item.text) {
            currentLyric.value = item.text;
            lastCharStartTime = item.startTime;
        }
    };

    const getSynchronizedPosition = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>): number => {
        if (!isPlaying.value) {
            return Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, lastEventPosition);
        }

        if (lastEventTimestamp > 0) {
            const elapsed = Math.max(0, performance.now() - lastEventTimestamp);
            return lastEventPosition + elapsed;
        }

        return Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, lastEventPosition);
    };

    const stopPlaybackTicker = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    const startPlaybackTicker = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
        stopPlaybackTicker();

        const tick = () => {
            if (!isPlaying.value) return;
            const position = getSynchronizedPosition(textAlivePlayer);
            updateLyricIfAvailable(textAlivePlayer, position);
            animationFrameId = requestAnimationFrame(tick);
        };

        animationFrameId = requestAnimationFrame(tick);
    };

    const bindPlayerListeners = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
        textAlivePlayer.addListener({
            onVideoReady: () => {
                currentLyric.value = "";
                lastCharStartTime = -1;
                playheadPosition.value = 0;
                lastEventPosition = 0;
                lastEventTimestamp = 0;
                rebuildTimedChars(textAlivePlayer);
            },
            onTimeUpdate: (position: number) => {
                markEventPosition(position);
                updateLyricIfAvailable(textAlivePlayer, position);
            },
            onThrottledTimeUpdate: (position: number) => {
                markEventPosition(position);
                updateLyricIfAvailable(textAlivePlayer, position);
            },
            onPlay: () => {
                isPlaying.value = true;
                markEventPosition(Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, playheadPosition.value));
                startPlaybackTicker(textAlivePlayer);
                updateLyricIfAvailable(textAlivePlayer, getSynchronizedPosition(textAlivePlayer));
            },
            onPause: () => {
                isPlaying.value = false;
                stopPlaybackTicker();
            },
            onStop: () => {
                isPlaying.value = false;
                stopPlaybackTicker();
            },
        });
    };

    const ensurePlayer = async () => {
        if (player.value) return player.value;
        const token = await fetchTextAliveToken();
        player.value = createTextAlivePlayer(token, mediaMountElement.value ?? undefined);
        bindPlayerListeners(player.value);
        return player.value;
    };

    const loadSong = async (songUrl: string) => {
        stopPlaybackTicker();
        isPlaying.value = false;
        textAliveLoading.value = true;
        textAliveReady.value = false;
        textAliveError.value = "";

        try {
            const textAlivePlayer = await ensurePlayer();
            await textAlivePlayer.createFromSongUrl(songUrl);
            currentLyric.value = "";
            lastCharStartTime = -1;
            playheadPosition.value = 0;
            lastEventPosition = 0;
            lastEventTimestamp = 0;
            rebuildTimedChars(textAlivePlayer);
            textAliveReady.value = true;
        } catch (error) {
            textAliveError.value = error instanceof Error ? error.message : "TextAlive Player の初期化に失敗しました";
        } finally {
            textAliveLoading.value = false;
        }
    };

    const play = () => {
        if (!player.value) return;
        isPlaying.value = true;
        markEventPosition(Math.max(player.value.videoPosition, player.value.mediaPosition, playheadPosition.value));
        startPlaybackTicker(player.value);
        updateLyricIfAvailable(player.value, getSynchronizedPosition(player.value));
        player.value.requestPlay();
    };

    const pause = () => {
        isPlaying.value = false;
        stopPlaybackTicker();
        player.value?.requestPause();
    };

    const setMediaMount = (element: HTMLElement) => {
        mediaMountElement.value = element;
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
        setMediaMount,
        loadSong,
        play,
        pause,
    };
};