import type { Match, Stage, Round } from "@/types";

export interface StageGroup {
  name: string;
  matches: Match[];
}

/**
 * Collects every fixture contained in a stage, regardless of nesting depth.
 * The SportMonks schedule endpoint nests fixtures differently per competition:
 * - Cup round with direct fixtures: `Stage → fixtures`
 * - Standard structure: `Stage → rounds → fixtures`
 * - Multi-phase structure: `Stage → stages → rounds → fixtures`
 */
const collectStageFixtures = (stage: Stage): Match[] => {
  const direct = stage.fixtures ?? [];
  const fromRounds = (stage.rounds ?? []).flatMap(
    (r: Round) => r.fixtures ?? [],
  );
  const fromNested = (stage.stages ?? []).flatMap(collectStageFixtures);
  return [...direct, ...fromRounds, ...fromNested];
};

/**
 * Groups cup fixtures by their stage name for bracket display.
 * Each stage becomes one bracket column; empty stages are dropped.
 *
 * @param data - A single stage or an array of stages returned by the backend
 * @returns An array of stage groups, each with a name and its matches
 */
export const groupMatchesByStage = (data: Stage | Stage[]): StageGroup[] => {
  const items: Stage[] = Array.isArray(data) ? data : [data];

  return items
    .map((item) => ({
      name: item.name ?? "Tour",
      matches: collectStageFixtures(item),
    }))
    .filter((group) => group.matches.length > 0);
};
