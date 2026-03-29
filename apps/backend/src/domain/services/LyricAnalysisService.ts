export interface LyricAnalysisInput {
  lyric: string;
  bpm: number;
}

export interface LyricAnalysisResult {
  energyScore: number;
  mood: "calm" | "dramatic" | "uplift";
}

export interface LyricAnalysisService {
  analyze(input: LyricAnalysisInput): Promise<LyricAnalysisResult>;
}