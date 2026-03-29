<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  lyric: string;
  playing: boolean;
  playheadPosition: number;
  firstCharStartTime: number;
}>();

const introCountdown = computed(() => {
  if (props.firstCharStartTime <= 0) return 0;
  const diff = props.firstCharStartTime - props.playheadPosition;
  return diff > 0 ? Math.ceil(diff / 1000) : 0;
});

const displayLyric = computed(() => {
  if (props.lyric) return props.lyric;
  if (introCountdown.value > 0) return `歌詞開始まで ${introCountdown.value}s`;
  return "♪";
});

const pointerX = ref(0);
const pointerY = ref(0);
const nudgeX = ref(0);
const nudgeY = ref(0);
const keyBoost = ref(0);
const activeKeys = ref<string[]>([]);

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const onMouseMove = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  pointerX.value = clamp((x - 0.5) * 2, -1, 1);
  pointerY.value = clamp((y - 0.5) * 2, -1, 1);
};

const normalizeKey = (key: string): string => {
  if (key === " ") return "Space";
  return key.length === 1 ? key.toUpperCase() : key;
};

const onKeyDown = (event: KeyboardEvent) => {
  const key = normalizeKey(event.key);
  if (!activeKeys.value.includes(key)) {
    activeKeys.value = [...activeKeys.value, key].slice(0, 4);
  }

  if (key === "ArrowLeft" || key === "A") nudgeX.value = clamp(nudgeX.value - 10, -60, 60);
  if (key === "ArrowRight" || key === "D") nudgeX.value = clamp(nudgeX.value + 10, -60, 60);
  if (key === "ArrowUp" || key === "W") nudgeY.value = clamp(nudgeY.value - 10, -50, 50);
  if (key === "ArrowDown" || key === "S") nudgeY.value = clamp(nudgeY.value + 10, -50, 50);
  keyBoost.value = clamp(keyBoost.value + 0.12, 0, 1.2);
};

const onKeyUp = (event: KeyboardEvent) => {
  const key = normalizeKey(event.key);
  activeKeys.value = activeKeys.value.filter((item) => item !== key);
  keyBoost.value = clamp(keyBoost.value - 0.12, 0, 1.2);
};

const onMouseLeave = () => {
  pointerX.value = 0;
  pointerY.value = 0;
};

const distortion = computed(() => clamp(Math.abs(pointerX.value) + Math.abs(pointerY.value) + keyBoost.value, 0, 2.4));

const lyricStyle = computed(() => {
  const tx = pointerX.value * 30 + nudgeX.value;
  const ty = pointerY.value * 24 + nudgeY.value;
  const skew = pointerX.value * 8;
  const scale = 1 + distortion.value * 0.1;
  return {
    transform: `translate(${tx}px, ${ty}px) skew(${skew}deg) scale(${scale})`,
    letterSpacing: `${distortion.value * 0.06}em`,
  };
});

const shapeStyle = computed(() => {
  const tx = pointerX.value * 56 + nudgeX.value * 0.55;
  const ty = pointerY.value * 44 + nudgeY.value * 0.55;
  const rotate = pointerX.value * 22 + distortion.value * 8;
  const scale = 1 + distortion.value * 0.18;
  return {
    transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
    filter: `blur(${distortion.value * 2.4}px) saturate(${1.1 + distortion.value * 0.3})`,
    opacity: String(0.48 + Math.min(distortion.value * 0.25, 0.35)),
  };
});
</script>

<template>
  <section
    class="visualizer"
    tabindex="0"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
  >
    <div class="shape-base" :style="shapeStyle"></div>
    <div class="shape-accent" :style="shapeStyle"></div>
    <p class="lyric" :style="lyricStyle">{{ displayLyric }}</p>

    <footer class="hud">
      <p>操作: マウス移動 + WASD / 矢印キー</p>
      <p>表示: 歌詞を1文字ずつタイミング同期</p>
      <p>{{ playing ? "再生中" : "停止中" }} / Distortion: {{ distortion.toFixed(2) }}</p>
      <p>Position: {{ playheadPosition }}ms / FirstChar: {{ firstCharStartTime }}ms</p>
      <p v-if="activeKeys.length > 0">Keys: {{ activeKeys.join(" + ") }}</p>
    </footer>
  </section>
</template>

<style scoped>
.visualizer {
  min-height: 340px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 230, 190, 0.7), transparent 48%),
    radial-gradient(circle at 82% 84%, rgba(227, 106, 46, 0.24), transparent 42%),
    var(--panel);
  border: 1px solid var(--line);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  outline: none;
  isolation: isolate;
}

.shape-base,
.shape-accent {
  position: absolute;
  transition: transform 80ms linear, filter 120ms ease;
}

.shape-base {
  width: min(45vw, 280px);
  aspect-ratio: 1;
  border-radius: 42% 58% 54% 46% / 52% 32% 68% 48%;
  background: linear-gradient(145deg, #f2b24a, #e36a2e);
  mix-blend-mode: multiply;
}

.shape-accent {
  width: min(40vw, 220px);
  aspect-ratio: 1;
  border-radius: 26% 74% 69% 31% / 35% 25% 75% 65%;
  background: linear-gradient(125deg, rgba(255, 227, 194, 0.95), rgba(248, 173, 108, 0.85));
  mix-blend-mode: screen;
}

.lyric {
  position: relative;
  z-index: 2;
  max-width: 88%;
  margin: 0;
  text-align: center;
  font-size: clamp(1.2rem, 3.6vw, 2.4rem);
  font-weight: 800;
  color: #2e2318;
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.85);
  transition: transform 80ms linear, letter-spacing 80ms linear;
  user-select: none;
}

.hud {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.9rem;
  display: grid;
  gap: 0.2rem;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  background: rgba(255, 250, 243, 0.82);
  border: 1px solid rgba(217, 197, 174, 0.85);
  backdrop-filter: blur(6px);
  z-index: 3;
}

.hud p {
  margin: 0;
  font-size: 0.85rem;
  color: #4f3d2c;
}
</style>