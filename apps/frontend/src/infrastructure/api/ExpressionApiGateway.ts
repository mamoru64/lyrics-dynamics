import axios from "axios";
import type { ExpressionGateway } from "../../domain/repositories/ExpressionGateway";
import type { RealtimeExpression } from "../../domain/entities/RealtimeExpression";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
});

export class ExpressionApiGateway implements ExpressionGateway {
  async analyzeRealtime(input: { lyric: string; bpm: number; timestamp: number }): Promise<RealtimeExpression> {
    const { data } = await api.post<RealtimeExpression>("/api/expressions/realtime", input);
    return data;
  }

  async getRecent(limit: number): Promise<RealtimeExpression[]> {
    const { data } = await api.get<RealtimeExpression[]>(`/api/expressions/recent?limit=${limit}`);
    return data;
  }
}