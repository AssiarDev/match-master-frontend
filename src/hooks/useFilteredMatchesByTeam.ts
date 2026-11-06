import { useMemo } from "react";
import type { Match, Stage } from "../types";
import { useFetch } from "./useFetch";
import { extractFixtures } from "@/utils/extractFixtures";
import { getMatchStatus, type MatchStatus } from "@/utils/matchStatus";

type MatchFilter = "upcoming" | "finished" | "all";

const STATUSES_BY_FILTER: Record<
  Exclude<MatchFilter, "all">,
  readonly MatchStatus[]
> = {
  upcoming: ["upcoming", "live", "postponed"],
  finished: ["finished", "cancelled"],
};

/**
 * Fetches and filters matches for a specific team within a league.
 * Supports filtering by match status: 'upcoming', 'finished', or 'all'.
 * Every match belongs to one tab: live and postponed matches stay in 'upcoming',
 * cancelled matches go to 'finished', and each card shows its own status.
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
    return filtered
      .filter(
        (match) =>
          filter === "all" ||
          STATUSES_BY_FILTER[filter].includes(getMatchStatus(match.state_id)),
      )
      .sort((a, b) => b.starting_at_timestamp - a.starting_at_timestamp);
  }, [data, teamId, filter]);
};
