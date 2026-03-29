import songData from "./magicalMirai2026Songs.json";
import type { ContestSong } from "../../domain/entities/ContestSong";

export const contestSongs = songData as ContestSong[];

export const defaultContestSong = contestSongs[0] ?? null;