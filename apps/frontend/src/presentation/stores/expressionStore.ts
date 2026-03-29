import { defineStore } from "pinia";
import { ref } from "vue";
import type { RealtimeExpression } from "../../domain/entities/RealtimeExpression";
import { ExpressionApiGateway } from "../../infrastructure/api/ExpressionApiGateway";
import { AnalyzeRealtimeExpression } from "../../application/usecases/AnalyzeRealtimeExpression";

const usecase = new AnalyzeRealtimeExpression(new ExpressionApiGateway());

export const useExpressionStore = defineStore("expression", () => {
  const current = ref<RealtimeExpression | null>(null);
  const history = ref<RealtimeExpression[]>([]);
  const pending = ref(false);

  const analyze = async (lyric: string, bpm: number): Promise<void> => {
    pending.value = true;
    try {
      const expression = await usecase.execute({ lyric, bpm, timestamp: Date.now() });
      current.value = expression;
      history.value = [expression, ...history.value].slice(0, 20);
    } finally {
      pending.value = false;
    }
  };

  return { current, history, pending, analyze };
});