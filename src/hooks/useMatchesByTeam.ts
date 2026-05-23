import { useMemo } from "react";
import type { Match } from "../types";
import { useFetch } from "./useFetch";

interface RawMatchData {
  matches: Array<{
    id: number;
    homeTeam: { id: number };
    awayTeam: { id: number };
    starting_at: string;
    state_id: number;
  }>;
}

/**
 * Fetches matches for a specific team within a league.
 * The request is skipped if either leagueId or teamId is missing.
 *
 * @param leagueId - ID of the league
 * @param teamId - ID of the team
 * @returns Filtered `Match[]`
 */
export const useMatchesByTeam = (
  leagueId?: number | string,
  teamId?: number | string,
) => {
  const { data } = useFetch<RawMatchData>(
    leagueId && teamId
      ? `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
      : null,
  );

  return useMemo<Match[]>(() => {
    if (!data?.matches) return [];
    return data.matches.filter(
      (match) =>
        match.homeTeam.id === Number(teamId) ||
        match.awayTeam.id === Number(teamId),
    ) as unknown as Match[];
  }, [data, teamId]);
};
