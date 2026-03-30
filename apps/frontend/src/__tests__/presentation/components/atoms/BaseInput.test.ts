import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseInput from "../../../../presentation/components/atoms/BaseInput.vue";

describe("BaseInput", () => {
    it("初期値を表示する", () => {
        const wrapper = mount(BaseInput, {
            props: { modelValue: "初期テキスト", "onUpdate:modelValue": () => {} },
        });

        expect((wrapper.find("input").element as HTMLInputElement).value).toBe("初期テキスト");
    });

    it("placeholder を表示する", () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: "",
                "onUpdate:modelValue": () => {},
                placeholder: "入力してください",
            },
        });

        expect(wrapper.find("input").attributes("placeholder")).toBe("入力してください");
    });

    it("入力時に update:modelValue イベントを発火する", async () => {
        const wrapper = mount(BaseInput, {
            props: { modelValue: "", "onUpdate:modelValue": () => {} },
        });

        await wrapper.find("input").setValue("新しいテキスト");

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")![0]).toEqual(["新しいテキスト"]);
    });
});
