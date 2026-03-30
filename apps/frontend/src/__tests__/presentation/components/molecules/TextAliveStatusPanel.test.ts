import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TextAliveStatusPanel from "../../../../presentation/components/molecules/TextAliveStatusPanel.vue";

describe("TextAliveStatusPanel", () => {
    it("すべてのステータスが非アクティブのとき active クラスが付かない", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: false,
                textAliveReady: false,
                isPlaying: false,
                textAliveError: "",
            },
        });

        const pills = wrapper.findAll(".status-pill");
        expect(pills).toHaveLength(3);
        for (const pill of pills) {
            expect(pill.classes()).not.toContain("active");
        }
    });

    it("textAliveLoading=true のとき読み込みピルが active になる", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: true,
                textAliveReady: false,
                isPlaying: false,
                textAliveError: "",
            },
        });

        const pills = wrapper.findAll(".status-pill");
        expect(pills[0].classes()).toContain("active");
        expect(pills[1].classes()).not.toContain("active");
        expect(pills[2].classes()).not.toContain("active");
    });

    it("textAliveReady=true のとき準備完了ピルが active になる", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: false,
                textAliveReady: true,
                isPlaying: false,
                textAliveError: "",
            },
        });

        const pills = wrapper.findAll(".status-pill");
        expect(pills[1].classes()).toContain("active");
    });

    it("isPlaying=true のとき再生中ピルが active になる", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: false,
                textAliveReady: false,
                isPlaying: true,
                textAliveError: "",
            },
        });

        const pills = wrapper.findAll(".status-pill");
        expect(pills[2].classes()).toContain("active");
    });

    it("エラーメッセージが設定されているとき表示する", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: false,
                textAliveReady: false,
                isPlaying: false,
                textAliveError: "接続に失敗しました",
            },
        });

        expect(wrapper.find(".textalive-error").exists()).toBe(true);
        expect(wrapper.find(".textalive-error").text()).toContain("接続に失敗しました");
    });

    it("エラーが空のときエラーメッセージを表示しない", () => {
        const wrapper = mount(TextAliveStatusPanel, {
            props: {
                textAliveLoading: false,
                textAliveReady: false,
                isPlaying: false,
                textAliveError: "",
            },
        });

        expect(wrapper.find(".textalive-error").exists()).toBe(false);
    });
});
