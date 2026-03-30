import { describe, it, expect } from "vitest";
import { contestSongs, defaultContestSong } from "../../shared/config/contestSongs";

describe("contestSongs", () => {
    it("1曲以上の楽曲データを含む", () => {
        expect(contestSongs.length).toBeGreaterThan(0);
    });

    it("各楽曲が必要なフィールドを持つ", () => {
        for (const song of contestSongs) {
            expect(song.id).toBeTruthy();
            expect(song.title).toBeTruthy();
            expect(song.artistName).toBeTruthy();
            expect(song.musicUrl).toBeTruthy();
            expect(song.lyricsUrl).toBeTruthy();
            expect(song.textaliveSongUrl).toBeTruthy();
            expect(song.textaliveLyricsUrl).toBeTruthy();
            expect(song.sourceUrl).toBeTruthy();
        }
    });

    it("各楽曲のIDが一意である", () => {
        const ids = contestSongs.map((song) => song.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});

describe("defaultContestSong", () => {
    it("先頭の楽曲をデフォルトとして返す", () => {
        expect(defaultContestSong).toEqual(contestSongs[0]);
    });

    it("nullではない", () => {
        expect(defaultContestSong).not.toBeNull();
    });
});
