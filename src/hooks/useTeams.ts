import { useState, useEffect } from "react";
import type { Competition, Team } from "../types";

export interface TeamWithLeague extends Team {
  leagueId: number;
}

interface RawTeamItem {
  team?: {
    id: number;
    name?: string;
    image_path?: string;
    short_code?: string;
  };
}

/**
 * Fetches and deduplicates teams across all provided competitions.
 * Each team retains the ID of the first competition it was found in,
 * so it can be passed as selectedLeague when navigating to TeamsDetails.
 *
 * @param competitions - List of competitions to fetch teams from
 * @returns `{ teams, loading }`
 */
export const useTeams = (competitions: Competition[]) => {
  const [teams, setTeams] = useState<TeamWithLeague[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (competitions.length === 0) return;

    setLoading(true);
    const controller = new AbortController();

    Promise.all(
      competitions.map((c) =>
        fetch(`${import.meta.env.VITE_API_URL}/competitions/${c.id}/teams`, {
          signal: controller.signal,
        })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
          .then((data: unknown) => ({ leagueId: c.id, data })),
      ),
    )
      .then((results) => {
        const seen = new Set<number>();
        const allTeams: TeamWithLeague[] = [];

        for (const { leagueId, data } of results) {
          if (!Array.isArray(data)) continue;
          for (const item of data as RawTeamItem[]) {
            if (item.team?.name && !seen.has(item.team.id)) {
              seen.add(item.team.id);
              allTeams.push({
                id: item.team.id,
                name: item.team.name as string,
                image: item.team.image_path ?? "",
                shortName: item.team.short_code,
                leagueId,
              });
            }
          }
        }

        setTeams(allTeams);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, [competitions]);

  return { teams, loading };
};
