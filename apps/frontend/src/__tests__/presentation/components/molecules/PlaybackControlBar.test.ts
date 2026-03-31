import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PlaybackControlBar from "../../../../presentation/components/molecules/PlaybackControlBar.vue";

const defaultProps = {
    playing: false,
    volume: 50,
    isMuted: false,
    controlsEnabled: true,
    activeKeys: [],
};

describe("PlaybackControlBar", () => {
    it("再生中でないとき再生ボタンを表示する", () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        expect(wrapper.find("[aria-label='再生']").exists()).toBe(true);
        expect(wrapper.find("[aria-label='一時停止']").exists()).toBe(false);
    });

    it("再生中のとき一時停止ボタンを表示する", () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, playing: true },
        });

        expect(wrapper.find("[aria-label='一時停止']").exists()).toBe(true);
        expect(wrapper.find("[aria-label='再生']").exists()).toBe(false);
    });

    it("再生ボタンをクリックすると playSong イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        await wrapper.find("[aria-label='再生']").trigger("click");

        expect(wrapper.emitted("playSong")).toHaveLength(1);
    });

    it("一時停止ボタンをクリックすると pauseSong イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, playing: true },
        });

        await wrapper.find("[aria-label='一時停止']").trigger("click");

        expect(wrapper.emitted("pauseSong")).toHaveLength(1);
    });

    it("音量スライダーの値が volume プロパティと一致する", () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, volume: 75 },
        });

        const slider = wrapper.find("[aria-label='音量']").element as HTMLInputElement;
        expect(Number(slider.value)).toBe(75);
    });

    it("音量スライダーを操作すると volumeChange イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        const slider = wrapper.find("[aria-label='音量']");
        await slider.setValue(80);

        expect(wrapper.emitted("volumeChange")).toBeTruthy();
        expect(wrapper.emitted("volumeChange")![0]).toEqual([80]);
    });

    it("音量を上げるボタンをクリックすると volumeUp イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        await wrapper.find("[aria-label='音量を上げる']").trigger("click");

        expect(wrapper.emitted("volumeUp")).toHaveLength(1);
    });

    it("音量を下げるボタンをクリックすると volumeDown イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        await wrapper.find("[aria-label='音量を下げる']").trigger("click");

        expect(wrapper.emitted("volumeDown")).toHaveLength(1);
    });

    it("ミュート切替ボタンをクリックすると toggleMute イベントを発火する", async () => {
        const wrapper = mount(PlaybackControlBar, { props: defaultProps });

        await wrapper.find("[aria-label='ミュート切替']").trigger("click");

        expect(wrapper.emitted("toggleMute")).toHaveLength(1);
    });

    it("controlsEnabled=false のときすべてのボタンが無効化される", () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, controlsEnabled: false },
        });

        const buttons = wrapper.findAll("button");
        for (const button of buttons) {
            expect(button.element.disabled).toBe(true);
        }
    });

    it("activeKeys が設定されているときキー表示を表示する", () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, activeKeys: ["A", "S"] },
        });

        expect(wrapper.find("footer p").text()).toBe("A + S");
    });

    it("activeKeys が空のときキー表示を表示しない", () => {
        const wrapper = mount(PlaybackControlBar, {
            props: { ...defaultProps, activeKeys: [] },
        });

        expect(wrapper.find("footer p").exists()).toBe(false);
    });
});
