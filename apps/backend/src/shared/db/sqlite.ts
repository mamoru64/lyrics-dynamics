import path from "node:path";
import { mkdirSync } from "node:fs";
import sqlite3 from "sqlite3";

const dataDir = path.resolve(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "lyrics-dynamics.db");

export const db = new sqlite3.Database(dbPath);

export const initializeDatabase = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS expressions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lyric TEXT NOT NULL,
        bpm REAL NOT NULL,
        energy_score REAL NOT NULL,
        text_size INTEGER NOT NULL,
        text_weight INTEGER NOT NULL,
        text_color TEXT NOT NULL,
        shape_kind TEXT NOT NULL,
        shape_intensity REAL NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
      (error) => {
        if (error) reject(error);
        else resolve();
      },
    );
  });
};