<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";

defineProps<{
  textAliveLoading: boolean;
  textAliveReady: boolean;
  isPlaying: boolean;
  textAliveError: string;
}>();
</script>

<template>
  <section class="textalive-panel">
    <div class="status-icons">
      <span class="status-pill" :class="{ active: textAliveLoading }" title="読み込み中">●</span>
      <span class="status-pill" :class="{ active: textAliveReady }" title="再生準備完了">◆</span>
      <span class="status-pill" :class="{ active: isPlaying }" title="再生中">▶</span>
    </div>
    <p v-if="textAliveError" class="textalive-error">
      <AlertTriangle :size="14" />
      <span>{{ textAliveError }}</span>
    </p>
  </section>
</template>

<style scoped>
.textalive-panel {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
}

.status-icons {
  display: flex;
  gap: 0.6rem;
}

.status-pill {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  color: #42648f;
  background: #f2f8ff;
}

.status-pill.active {
  color: #ffffff;
  background: var(--accent);
}

.textalive-error {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #ba2b2b;
}
</style>
