import { useMemo } from "react";
import type { Match, Stage } from "../types";
import { useFetch } from "./useFetch";
import { extractFixtures } from "@/utils/extractFixtures";

/**
 * Fetches the 5 most recent finished matches (state_id === 5) for a competition,
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
      .filter((f) => f.state_id === 5)
      .sort(
        (a, b) =>
          new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime(),
      )
      .slice(0, 5);
  }, [data]);
};
