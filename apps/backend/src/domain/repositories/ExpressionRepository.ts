import type { RealtimeExpression } from "../entities/RealtimeExpression.js";

export interface ExpressionRepository {
  save(expression: RealtimeExpression): Promise<void>;
  listRecent(limit: number): Promise<RealtimeExpression[]>;
}