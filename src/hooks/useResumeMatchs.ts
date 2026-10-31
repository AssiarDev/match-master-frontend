import { useMemo } from "react";
import type { Match, Stage } from "../types";
import { useFetch } from "./useFetch";
import { extractFixtures } from "@/utils/extractFixtures";
import { getMatchStatus } from "@/utils/matchStatus";

/**
 * Fetches the 5 most recent finished matches for a competition,
 * sorted by date descending.
 *
 * @param competitionId - ID of the competition
 * @returns `Match[]` (max 5 results)
 */
export const useResumeMatchs = (competitionId?: number | string) => {
  const { data } = useFetch<Stage | Stage[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
      : null,
  );

  return useMemo<Match[]>(() => {
    if (!data) return [];
    const allFixtures = extractFixtures(data);
    return allFixtures
      .filter((f) => getMatchStatus(f.state_id) === "finished")
      .sort((a, b) => b.starting_at_timestamp - a.starting_at_timestamp)
      .slice(0, 5);
  }, [data]);
};
