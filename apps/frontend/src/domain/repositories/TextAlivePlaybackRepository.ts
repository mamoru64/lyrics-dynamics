export type TimedChar = {
    text: string;
    startTime: number;
    endTime: number;
};

export type LoadTextAliveSongOptions = {
    lyricsUrl?: string;
};

export type TextAlivePlaybackListener = {
    onVideoReady?: () => void;
    onTimeUpdate?: (position: number) => void;
    onThrottledTimeUpdate?: (position: number) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onStop?: () => void;
    onVolumeUpdate?: (volume: number) => void;
};

export interface TextAlivePlaybackRepository {
    initialize(params: { token: string; mediaElement?: HTMLElement }): void;
    setMediaElement(element: HTMLElement): void;
    addListener(listener: TextAlivePlaybackListener): void;
    loadSong(songUrl: string, options?: LoadTextAliveSongOptions): Promise<TimedChar[]>;
    requestPlay(): void;
    requestPause(): void;
    setVolume(volume: number): void;
    getVolume(): number;
    getVideoPosition(): number;
    getMediaPosition(): number;
}
