import type { Match } from "../types";
import { MATCH_TIME_ZONE } from "./constants";

const monthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: MATCH_TIME_ZONE,
});

/**
 * Groups matches by month, in French and whatever the browser language.
 *
 * Reads `starting_at_timestamp` because `starting_at` has no time zone and
 * browsers parse its format differently.
 *
 * @param matches - Matches to group
 * @returns Matches keyed by month label, e.g. `janvier 2025`
 */
export const groupMatchesByMonth = (
  matches: Match[],
): Record<string, Match[]> => {
  return matches.reduce<Record<string, Match[]>>((acc, match) => {
    const key = monthFormatter.format(
      new Date(match.starting_at_timestamp * 1000),
    );
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
};
