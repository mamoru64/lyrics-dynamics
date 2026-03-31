import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseSelect from "../../../../presentation/components/atoms/BaseSelect.vue";

const options = [
    { label: "オプション1", value: "option1" },
    { label: "オプション2", value: "option2" },
    { label: "オプション3", value: "option3" },
];

describe("BaseSelect", () => {
    it("渡されたすべてのオプションを表示する", () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: "option1",
                "onUpdate:modelValue": () => {},
                options,
            },
        });

        const optionElements = wrapper.findAll("option");
        expect(optionElements).toHaveLength(3);
        expect(optionElements[0].text()).toBe("オプション1");
        expect(optionElements[1].text()).toBe("オプション2");
        expect(optionElements[2].text()).toBe("オプション3");
    });

    it("modelValue に対応するオプションが選択されている", () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: "option2",
                "onUpdate:modelValue": () => {},
                options,
            },
        });

        expect((wrapper.find("select").element as HTMLSelectElement).value).toBe("option2");
    });

    it("選択変更時に update:modelValue イベントを発火する", async () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: "option1",
                "onUpdate:modelValue": () => {},
                options,
            },
        });

        await wrapper.find("select").setValue("option3");

        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")![0]).toEqual(["option3"]);
    });
});
