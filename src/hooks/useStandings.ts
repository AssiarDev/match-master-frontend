import type { StandingEntry } from "../types";
import { useFetch } from "./useFetch";

/**
 * Fetches the standings for a competition.
 * The request is skipped if no competitionId is provided.
 *
 * @param competitionId - ID of the competition
 * @returns `{ standings, loading, error }`
 */
export const useStandings = (competitionId?: number | string) => {
  const { data, loading, error } = useFetch<StandingEntry[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/standings/${competitionId}`
      : null,
  );

  return { standings: data ?? [], loading, error };
};
