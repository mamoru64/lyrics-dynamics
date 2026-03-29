<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../atoms/BaseButton.vue";
import BaseInput from "../atoms/BaseInput.vue";

const emit = defineEmits<{
  submit: [lyric: string, bpm: number];
}>();

const lyric = ref("");
const bpmText = ref("120");

const onSubmit = () => {
  const bpm = Number(bpmText.value || 120);
  emit("submit", lyric.value, bpm);
};
</script>

<template>
  <div class="lyric-form">
    <BaseInput v-model="lyric" placeholder="歌詞フレーズを入力" />
    <BaseInput v-model="bpmText" placeholder="BPM" />
    <BaseButton @click="onSubmit">リアルタイム分析</BaseButton>
  </div>
</template>

<style scoped>
.lyric-form {
  display: grid;
  gap: 0.8rem;
}
</style>