import type { Match, ScoreDetail, ScoresWrapper } from "@/types";

export const FINISHED_STATES = new Set([5, 6, 7, 8, 12]);

export const normalizeScores = (rawScores: Match["scores"]): ScoreDetail[] => {
  if (!rawScores) return [];
  if (Array.isArray(rawScores)) return rawScores;
  if (Array.isArray((rawScores as ScoresWrapper).data))
    return (rawScores as ScoresWrapper).data!;
  return [];
};

export const extractFinalScore = (
  rawScores: Match["scores"],
): { home: number; away: number } => {
  const scores = normalizeScores(rawScores);
  let home = 0;
  let away = 0;
  scores.forEach((s) => {
    if (!s?.score) return;
    const goals = typeof s.score.goals === "number" ? s.score.goals : 0;
    if (s.score.participant === "home") home = Math.max(home, goals);
    if (s.score.participant === "away") away = Math.max(away, goals);
  });
  return { home, away };
};
