import type { ExpressionGateway } from "../../domain/repositories/ExpressionGateway";

export class AnalyzeRealtimeExpression {
  constructor(private readonly gateway: ExpressionGateway) {}

  execute(input: { lyric: string; bpm: number; timestamp: number }) {
    return this.gateway.analyzeRealtime(input);
  }
}