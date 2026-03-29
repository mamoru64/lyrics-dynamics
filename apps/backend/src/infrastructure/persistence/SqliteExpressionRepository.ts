import sqlite3 from "sqlite3";
import type { RealtimeExpression } from "../../domain/entities/RealtimeExpression.js";
import type { ExpressionRepository } from "../../domain/repositories/ExpressionRepository.js";

export class SqliteExpressionRepository implements ExpressionRepository {
  constructor(private readonly db: sqlite3.Database) {}

  async save(expression: RealtimeExpression): Promise<void> {
    await this.run(
      `INSERT INTO expressions (lyric, bpm, energy_score, text_size, text_weight, text_color, shape_kind, shape_intensity, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expression.lyric,
        expression.bpm,
        expression.energyScore,
        expression.textStyle.size,
        expression.textStyle.weight,
        expression.textStyle.color,
        expression.shape.kind,
        expression.shape.intensity,
        expression.timestamp,
      ],
    );
  }

  async listRecent(limit: number): Promise<RealtimeExpression[]> {
    const rows = await this.all<{
      lyric: string;
      bpm: number;
      energy_score: number;
      text_size: number;
      text_weight: number;
      text_color: string;
      shape_kind: "circle" | "polygon" | "wave";
      shape_intensity: number;
      timestamp: number;
    }>(
      `SELECT lyric, bpm, energy_score, text_size, text_weight, text_color, shape_kind, shape_intensity, timestamp
       FROM expressions ORDER BY id DESC LIMIT ?`,
      [limit],
    );

    return rows.map((row) => ({
      lyric: row.lyric,
      bpm: row.bpm,
      energyScore: row.energy_score,
      textStyle: {
        size: row.text_size,
        weight: row.text_weight,
        color: row.text_color,
      },
      shape: {
        kind: row.shape_kind,
        intensity: row.shape_intensity,
      },
      timestamp: row.timestamp,
    }));
  }

  private run(query: string, params: unknown[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private all<T>(query: string, params: unknown[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all<T>(query, params, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
  }
}