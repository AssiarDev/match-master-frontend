import { useMemo } from "react";
import { useLiveStreamContext } from "@/context/LiveStreamContext";
import { LiveMatchCard } from "./LiveMatchCard";
import { INPLAY_STATES } from "@/utils/constants";
import type { LiveMatch } from "@/types";

interface LeagueGroup {
  name: string;
  image_path: string | null;
  matches: LiveMatch[];
}
/**
 * Groups live matches by league_id.
 * Matches without a league fall under a 'unknown' key.
 */
const groupByLeague = (matches: LiveMatch[]): Record<string, LeagueGroup> => {
  return matches.reduce<Record<string, LeagueGroup>>((acc, match) => {
    const key = String(match.league_id);

    if (!acc[key]) {
      acc[key] = {
        name: match.league?.name ?? "Compétition inconnue",
        image_path: match.league?.image_path ?? null,
        matches: [],
      };
    }

    acc[key].matches.push(match);
    return acc;
  }, {});
};

export const Live = () => {
  const { matches, connected, error } = useLiveStreamContext();
  const activeMatches = useMemo(
    () =>
      matches.filter(
        (m) =>
          m.state?.developer_name && INPLAY_STATES.has(m.state.developer_name),
      ),
    [matches],
  );
  const grouped = useMemo(() => groupByLeague(activeMatches), [activeMatches]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6 py-6 sm:py-8 px-3 sm:px-4">
      {/* Header + connection status */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
          Matchs en direct
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500" : "bg-zinc-600"}`}
          />
          <span className="text-xs sm:text-sm text-zinc-400">
            {connected ? "Connecté" : "Connexion..."}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}

      {!connected && !error && (
        <p className="text-zinc-400 text-center mt-10 text-sm">
          Connexion au flux en direct...
        </p>
      )}

      {connected && activeMatches.length === 0 && (
        <p className="text-zinc-400 text-center mt-10 text-base sm:text-lg">
          Aucun match en direct pour le moment.
        </p>
      )}

      {/* Matches grouped by competition */}
      {Object.entries(grouped).map(([key, group]) => (
        <div key={key} className="mb-4 sm:mb-8">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            {group.image_path && (
              <img src={group.image_path} alt="" className="h-5" />
            )}
            <h2 className="text-lg sm:text-2xl font-bold text-zinc-100">
              {group.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {group.matches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
