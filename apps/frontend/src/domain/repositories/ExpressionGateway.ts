import type { RealtimeExpression } from "../entities/RealtimeExpression";

export interface ExpressionGateway {
  analyzeRealtime(input: { lyric: string; bpm: number; timestamp: number }): Promise<RealtimeExpression>;
  getRecent(limit: number): Promise<RealtimeExpression[]>;
}