import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SongSelectorPanel from "../../../../presentation/components/molecules/SongSelectorPanel.vue";
import type { ContestSong } from "../../../../domain/entities/ContestSong";

const songs: ContestSong[] = [
    {
        id: "song-1",
        title: "テスト曲1",
        artistName: "アーティスト1",
        musicUrl: "https://example.com/music1",
        lyricsUrl: "https://example.com/lyrics1",
        textaliveSongUrl: "https://example.com/textalive-song1",
        textaliveLyricsUrl: "https://example.com/textalive-lyrics1",
        sourceUrl: "https://example.com/source1",
    },
    {
        id: "song-2",
        title: "テスト曲2",
        artistName: "アーティスト2",
        musicUrl: "https://example.com/music2",
        lyricsUrl: "https://example.com/lyrics2",
        textaliveSongUrl: "https://example.com/textalive-song2",
        textaliveLyricsUrl: "https://example.com/textalive-lyrics2",
        sourceUrl: "https://example.com/source2",
    },
];

describe("SongSelectorPanel", () => {
    it("アプリケーションタイトルを表示する", () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs, selectedSongId: "song-1" },
        });

        expect(wrapper.find("h1").text()).toBe("Lyrics Dynamics");
    });

    it("選択した楽曲のタイトルとアーティスト名を表示する", () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs, selectedSongId: "song-1" },
        });

        expect(wrapper.find(".song-title").text()).toBe("テスト曲1");
        expect(wrapper.find(".song-artist").text()).toBe("アーティスト1");
    });

    it("楽曲セレクタにすべての楽曲オプションを表示する", () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs, selectedSongId: "song-1" },
        });

        const options = wrapper.findAll("option");
        expect(options).toHaveLength(2);
        expect(options[0].text()).toBe("テスト曲1 / アーティスト1");
        expect(options[1].text()).toBe("テスト曲2 / アーティスト2");
    });

    it("楽曲変更時に selectSong イベントを発火する", async () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs, selectedSongId: "song-1" },
        });

        await wrapper.find("select").setValue("song-2");

        expect(wrapper.emitted("selectSong")).toBeTruthy();
        expect(wrapper.emitted("selectSong")![0]).toEqual(["song-2"]);
    });

    it("選択中の楽曲の各リンクを表示する", () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs, selectedSongId: "song-1" },
        });

        const links = wrapper.findAll(".song-links a");
        expect(links).toHaveLength(4);
        expect(links[0].attributes("href")).toBe("https://example.com/music1");
        expect(links[1].attributes("href")).toBe("https://example.com/textalive-song1");
        expect(links[2].attributes("href")).toBe("https://example.com/lyrics1");
        expect(links[3].attributes("href")).toBe("https://example.com/source1");
    });

    it("楽曲リストが空のとき楽曲メタ情報を表示しない", () => {
        const wrapper = mount(SongSelectorPanel, {
            props: { songs: [], selectedSongId: "" },
        });

        expect(wrapper.find(".song-meta").exists()).toBe(false);
    });
});
