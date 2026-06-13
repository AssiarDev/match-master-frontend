import type { Match, Stage, Round } from "@/types";

/**
 * Flattens a SportMonks schedule response into a flat array of matches.
 * Handles three response shapes depending on competition type:
 * - Flat league (e.g. Eredivisie): `Stage[] → rounds → fixtures`
 * - Staged competition (e.g. Championship): `Stage[] → stages → rounds → fixtures`
 * - Cup competition (e.g. FA Cup): `Stage[] → fixtures` (no rounds)
 *
 * @param data - A single stage or an array of stages returned by the backend
 * @returns A flat array of matches across all rounds and stages
 */
export const extractFixtures = (data: Stage | Stage[]): Match[] => {
  const items: Stage[] = Array.isArray(data) ? data : [data];

  return items.flatMap((item) => {
    if (item.stages?.length) {
      return item.stages.flatMap((s: Stage) =>
        (s.rounds ?? []).flatMap((r: Round) => r.fixtures ?? []),
      );
    }
    if (item.rounds?.length) {
      return item.rounds.flatMap((r: Round) => r.fixtures ?? []);
    }
    return item.fixtures ?? [];
  });
};
