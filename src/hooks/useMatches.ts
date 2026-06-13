import { useMemo } from "react";
import type { Stage } from "../types";
import { useFetch } from "./useFetch";
import { extractFixtures } from "@/utils/extractFixtures";

/**
 * Fetches all matches for a competition, flattening stages and rounds.
 * The request is skipped if no competitionId is provided.
 *
 * @param competitionId - ID of the competition
 * @returns `{ matches, loading, error }`
 */
export const useMatches = (competitionId?: number | string) => {
  const { data, loading, error } = useFetch<Stage | Stage[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
      : null,
  );

  const matches = useMemo(() => (data ? extractFixtures(data) : []), [data]);

  return { matches, loading, error };
};
