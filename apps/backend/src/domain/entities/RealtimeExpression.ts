export interface RealtimeExpression {
  lyric: string;
  bpm: number;
  energyScore: number;
  textStyle: {
    size: number;
    weight: number;
    color: string;
  };
  shape: {
    kind: "circle" | "polygon" | "wave";
    intensity: number;
  };
  timestamp: number;
}