<script setup lang="ts">
import type { RealtimeExpression } from "../../../domain/entities/RealtimeExpression";
import LyricForm from "../molecules/LyricForm.vue";
import ExpressionVisualizer from "../organisms/ExpressionVisualizer.vue";

defineProps<{
  expression: RealtimeExpression | null;
  pending: boolean;
}>();

const emit = defineEmits<{
  submit: [lyric: string, bpm: number];
}>();
</script>

<template>
  <main class="home-template">
    <header>
      <h1>Lyrics Dynamics</h1>
      <p>TextAlive App API連携を前提に、歌詞をリアルタイムに文字と図形へ変換します。</p>
    </header>
    <LyricForm @submit="(lyric, bpm) => emit('submit', lyric, bpm)" />
    <p v-if="pending">分析中...</p>
    <ExpressionVisualizer :expression="expression" />
  </main>
</template>

<style scoped>
.home-template {
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: grid;
  gap: 1.2rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3.8vw, 2.8rem);
}

p {
  margin: 0;
}
</style>