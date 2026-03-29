<script setup lang="ts">
import { computed } from "vue";
import { Minus, Pause, Play, Plus, Volume1, Volume2, VolumeX } from "lucide-vue-next";

const props = defineProps<{
  playing: boolean;
  volume: number;
  isMuted: boolean;
  controlsEnabled: boolean;
  activeKeys: string[];
}>();

const emit = defineEmits<{
  playSong: [];
  pauseSong: [];
  volumeUp: [];
  volumeDown: [];
  volumeChange: [nextVolume: number];
  toggleMute: [];
}>();

const volumeIcon = computed(() => {
  if (props.isMuted || props.volume <= 0) return VolumeX;
  if (props.volume < 40) return Volume1;
  return Volume2;
});

const onVolumeSliderInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("volumeChange", Number(target.value));
};
</script>

<template>
  <footer class="hud">
    <div class="hud-controls">
      <button
        class="icon-btn"
        :disabled="!controlsEnabled"
        :title="playing ? '一時停止' : '再生'"
        :aria-label="playing ? '一時停止' : '再生'"
        @click="playing ? emit('pauseSong') : emit('playSong')"
      >
        <Pause v-if="playing" :size="16" />
        <Play v-else :size="16" />
      </button>
      <button class="icon-btn" :disabled="!controlsEnabled" title="音量を下げる" aria-label="音量を下げる" @click="emit('volumeDown')">
        <Minus :size="16" />
      </button>
      <button class="icon-btn" :disabled="!controlsEnabled" title="ミュート切替" aria-label="ミュート切替" @click="emit('toggleMute')">
        <component :is="volumeIcon" :size="16" />
      </button>
      <input
        class="volume-slider"
        :disabled="!controlsEnabled"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="volume"
        aria-label="音量"
        @input="onVolumeSliderInput"
      />
      <button class="icon-btn" :disabled="!controlsEnabled" title="音量を上げる" aria-label="音量を上げる" @click="emit('volumeUp')">
        <Plus :size="16" />
      </button>
    </div>
    <p v-if="activeKeys.length > 0">{{ activeKeys.join(" + ") }}</p>
  </footer>
</template>

<style scoped>
.hud {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.9rem;
  display: grid;
  gap: 0.2rem;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  background: rgba(242, 248, 255, 0.86);
  border: 1px solid rgba(159, 194, 234, 0.85);
  backdrop-filter: blur(6px);
  z-index: 3;
}

.hud-controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: nowrap;
}

.icon-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 1px solid rgba(159, 194, 234, 0.95);
  background: #f7fbff;
  color: #1c3d67;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease, background-color 120ms ease, color 120ms ease;
}

.icon-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: var(--accent);
  background: #ffffff;
  color: var(--accent);
}

.icon-btn:active:not(:disabled) {
  transform: translateY(0);
  background: #dff0ff;
}

.icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.volume-slider {
  width: min(180px, 34vw);
  accent-color: var(--accent);
}

.volume-slider:hover {
  filter: brightness(1.04);
}

.hud p {
  margin: 0;
  font-size: 0.85rem;
  color: #2c4b73;
}
</style>
