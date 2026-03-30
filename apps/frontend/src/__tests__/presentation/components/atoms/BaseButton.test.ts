import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseButton from "../../../../presentation/components/atoms/BaseButton.vue";

describe("BaseButton", () => {
    it("スロットのテキストを表示する", () => {
        const wrapper = mount(BaseButton, {
            slots: { default: "クリック" },
        });

        expect(wrapper.text()).toBe("クリック");
    });

    it("デフォルトでは無効化されていない", () => {
        const wrapper = mount(BaseButton);

        expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
    });

    it("disabled=true のとき無効化される", () => {
        const wrapper = mount(BaseButton, {
            props: { disabled: true },
        });

        expect(wrapper.find("button").element.disabled).toBe(true);
    });

    it("クリックイベントが発火する", async () => {
        const wrapper = mount(BaseButton, {
            slots: { default: "送信" },
        });

        await wrapper.find("button").trigger("click");

        expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it("無効化時はクリックできない", async () => {
        const wrapper = mount(BaseButton, {
            props: { disabled: true },
        });

        await wrapper.find("button").trigger("click");

        expect(wrapper.find("button").element.disabled).toBe(true);
    });
});
