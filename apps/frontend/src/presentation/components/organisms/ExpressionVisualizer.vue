<script setup lang="ts">
import { computed } from "vue";
import type { RealtimeExpression } from "../../../domain/entities/RealtimeExpression";

const props = defineProps<{
  expression: RealtimeExpression | null;
}>();

const shapeClass = computed(() => {
  if (!props.expression) return "circle";
  return props.expression.shape.kind;
});
</script>

<template>
  <div class="visualizer" v-if="expression">
    <div class="shape" :class="shapeClass" :style="{ opacity: String(0.4 + expression.shape.intensity * 0.6) }"></div>
    <p
      class="lyric"
      :style="{
        color: expression.textStyle.color,
        fontSize: `${expression.textStyle.size}px`,
        fontWeight: String(expression.textStyle.weight),
      }"
    >
      {{ expression.lyric }}
    </p>
  </div>
  <div v-else class="empty">分析結果を待機中です</div>
</template>

<style scoped>
.visualizer {
  display: grid;
  place-items: center;
  min-height: 260px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.shape {
  position: absolute;
  width: 180px;
  height: 180px;
  background: linear-gradient(145deg, #f2b24a, #e36a2e);
  animation: pulse 1.5s infinite ease-in-out;
}

.shape.circle {
  border-radius: 50%;
}

.shape.polygon {
  clip-path: polygon(50% 0%, 85% 15%, 100% 50%, 80% 100%, 20% 100%, 0% 50%, 15% 15%);
}

.shape.wave {
  border-radius: 38% 62% 58% 42% / 42% 35% 65% 58%;
}

.lyric {
  z-index: 1;
  text-shadow: 0 1px 0 #fff;
}

.empty {
  min-height: 260px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--line);
  border-radius: 16px;
}

@keyframes pulse {
  0% {
    transform: scale(0.92);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(0.92);
  }
}
</style>