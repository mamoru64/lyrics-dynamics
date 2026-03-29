import type { RealtimeExpression } from "../../domain/entities/RealtimeExpression.js";
import type { ExpressionRepository } from "../../domain/repositories/ExpressionRepository.js";
import type { LyricAnalysisService } from "../../domain/services/LyricAnalysisService.js";

interface Input {
  lyric: string;
  bpm: number;
  timestamp: number;
}

export class GenerateRealtimeExpression {
  constructor(
    private readonly analyzer: LyricAnalysisService,
    private readonly repository: ExpressionRepository,
  ) {}

  async execute(input: Input): Promise<RealtimeExpression> {
    const result = await this.analyzer.analyze({ lyric: input.lyric, bpm: input.bpm });

    const expression: RealtimeExpression = {
      lyric: input.lyric,
      bpm: input.bpm,
      energyScore: result.energyScore,
      textStyle: {
        size: 16 + Math.round(result.energyScore * 20),
        weight: result.mood === "dramatic" ? 700 : 500,
        color: result.mood === "uplift" ? "#f2994a" : result.mood === "dramatic" ? "#eb5757" : "#2d9cdb",
      },
      shape: {
        kind: result.mood === "dramatic" ? "polygon" : result.mood === "uplift" ? "wave" : "circle",
        intensity: result.energyScore,
      },
      timestamp: input.timestamp,
    };

    await this.repository.save(expression);
    return expression;
  }
}