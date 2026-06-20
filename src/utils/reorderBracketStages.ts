import type { Match } from "@/types";
import type { StageGroup } from "./groupMatchesByStage";

/**
 * Reorders matches within each bracket stage so that consecutive pairs
 * correctly reflect the actual cup draw progression.
 *
 * Works backward from the final stage: for each participant in an advanced
 * match, we find the match they won in the previous stage and place it at
 * the corresponding position. This ensures the SVG connector lines link the
 * right pairs regardless of the order SportMonks returns fixtures.
 *
 * Unmatched matches (no winner data yet) are appended at the end of each stage.
 */
export const reorderBracketStages = (stages: StageGroup[]): StageGroup[] => {
  if (stages.length <= 1) return stages;

  const sorted = [...stages].sort(
    (a, b) => b.matches.length - a.matches.length,
  );
  const result: StageGroup[] = new Array(sorted.length);

  result[sorted.length - 1] = sorted[sorted.length - 1];

  for (let si = sorted.length - 2; si >= 0; si--) {
    const nextStage = result[si + 1];
    const currentStage = sorted[si];

    const orderedMatches: Match[] = [];
    const usedIds = new Set<number>();

    for (const nextMatch of nextStage.matches) {
      for (const participant of nextMatch.participants ?? []) {
        const feeder = currentStage.matches.find(
          (m) =>
            !usedIds.has(m.id) &&
            m.participants?.some(
              (p) => p.id === participant.id && p.meta?.winner === true,
            ),
        );
        if (feeder) {
          orderedMatches.push(feeder);
          usedIds.add(feeder.id);
        }
      }
    }

    const unmatched = currentStage.matches.filter((m) => !usedIds.has(m.id));
    result[si] = {
      ...currentStage,
      matches: [...orderedMatches, ...unmatched],
    };
  }

  return result;
};
