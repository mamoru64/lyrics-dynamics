import type {
  LyricAnalysisInput,
  LyricAnalysisResult,
  LyricAnalysisService,
} from "../../domain/services/LyricAnalysisService.js";

export class HeuristicLyricAnalysisService implements LyricAnalysisService {
  async analyze(input: LyricAnalysisInput): Promise<LyricAnalysisResult> {
    const dramaticWords = ["叫", "衝", "壊", "痛", "強"];
    const upliftWords = ["光", "笑", "飛", "夢", "明日"];

    const lyric = input.lyric;
    const dramaticHits = dramaticWords.filter((word) => lyric.includes(word)).length;
    const upliftHits = upliftWords.filter((word) => lyric.includes(word)).length;

    const baseEnergy = Math.min(1, Math.max(0, input.bpm / 180));
    const lexicalBoost = Math.min(0.4, (dramaticHits + upliftHits) * 0.1);
    const energyScore = Math.min(1, baseEnergy + lexicalBoost);

    let mood: LyricAnalysisResult["mood"] = "calm";
    if (dramaticHits > upliftHits) mood = "dramatic";
    if (upliftHits > dramaticHits) mood = "uplift";

    return { energyScore, mood };
  }
}