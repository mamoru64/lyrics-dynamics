import type {
    LoadTextAliveSongOptions,
    TextAlivePlaybackListener,
    TextAlivePlaybackRepository,
    TimedChar,
} from "../../domain/repositories/TextAlivePlaybackRepository";
import { createTextAlivePlayer } from "./player";

export class TextAlivePlaybackApiRepository implements TextAlivePlaybackRepository {
    private player: ReturnType<typeof createTextAlivePlayer> | null = null;
    private mediaElement: HTMLElement | undefined;
    private listeners: TextAlivePlaybackListener[] = [];

    initialize(params: { token: string; mediaElement?: HTMLElement }): void {
        if (this.player) {
            return;
        }

        this.mediaElement = params.mediaElement;
        this.player = createTextAlivePlayer(params.token, this.mediaElement);

        for (const listener of this.listeners) {
            this.player.addListener(listener);
        }
    }

    setMediaElement(element: HTMLElement): void {
        this.mediaElement = element;
    }

    addListener(listener: TextAlivePlaybackListener): void {
        this.listeners.push(listener);
        this.player?.addListener(listener);
    }

    async loadSong(songUrl: string, options?: LoadTextAliveSongOptions): Promise<TimedChar[]> {
        const player = this.ensurePlayer();
        await player.createFromSongUrl(songUrl);

        let timedChars = this.extractTimedChars();
        if (timedChars.length === 0 && options?.lyricsUrl) {
            const retryOptions = {
                altLyricsUrl: options.lyricsUrl,
                lyricsDirectAccess: true,
            } as unknown as Parameters<typeof player.createFromSongUrl>[1];

            await player.createFromSongUrl(songUrl, retryOptions);
            timedChars = this.extractTimedChars();
        }

        return timedChars;
    }

    requestPlay(): void {
        this.ensurePlayer().requestPlay();
    }

    requestPause(): void {
        this.ensurePlayer().requestPause();
    }

    setVolume(volume: number): void {
        this.ensurePlayer().volume = volume;
    }

    getVolume(): number {
        return this.ensurePlayer().volume;
    }

    getVideoPosition(): number {
        return this.ensurePlayer().videoPosition;
    }

    getMediaPosition(): number {
        return this.ensurePlayer().mediaPosition;
    }

    private ensurePlayer(): ReturnType<typeof createTextAlivePlayer> {
        if (!this.player) {
            throw new Error("TextAlive Player is not initialized");
        }

        return this.player;
    }

    private extractTimedChars(): TimedChar[] {
        const player = this.ensurePlayer();
        const list: TimedChar[] = [];
        let charNode = player.video?.firstChar ?? null;

        while (charNode) {
            list.push({
                text: charNode.text,
                startTime: charNode.startTime,
                endTime: charNode.endTime,
            });
            charNode = charNode.next;
        }

        return list;
    }
}
