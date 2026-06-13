import { useMemo } from "react";
import type { Match, Stage } from "../types";
import { useFetch } from "./useFetch";
import { extractFixtures } from "@/utils/extractFixtures";

type MatchFilter = "upcoming" | "finished" | "all";

/**
 * Fetches and filters matches for a specific team within a league.
 * Supports filtering by match status: 'upcoming', 'finished', or 'all'.
 * Results are sorted by date descending.
 *
 * @param leagueId - ID of the league
 * @param teamId - ID of the team
 * @param filter - Match filter: 'upcoming' | 'finished' | 'all' (default: 'all')
 * @returns Filtered and sorted `Match[]`
 */
export const useFilteredMatchesByTeam = (
  leagueId?: number | string,
  teamId?: number | string,
  filter: MatchFilter = "all",
) => {
  const { data } = useFetch<Stage | Stage[]>(
    leagueId && teamId
      ? `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
      : null,
  );

  return useMemo<Match[]>(() => {
    if (!data) return [];
    const allFixtures = extractFixtures(data);
    const filtered = allFixtures.filter((fixture) =>
      fixture.participants?.some((p) => p.id === Number(teamId)),
    );
    const now = new Date();
    return filtered
      .filter((match) => {
        const matchDate = new Date(match.starting_at);
        if (filter === "upcoming") return matchDate > now;
        if (filter === "finished") return matchDate <= now;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime(),
      );
  }, [data, teamId, filter]);
};
