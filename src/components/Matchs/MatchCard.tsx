import type { Match, MatchParticipant } from "../../types";
import { FavoriteButton } from "../Favorite/FavoriteButton";
import { FINISHED_STATES, extractFinalScore } from "../../utils/matchUtils";

interface MatchCardProps {
  item: Match;
  leagueId?: number;
}

/**
 * Card displaying a match with home/away teams, score (if finished), and favorite buttons.
 * Score normalization handles both array and wrapped API response shapes.
 */
export const MatchCard = ({ item, leagueId }: MatchCardProps) => {
  if (!item) return null;

  const home: MatchParticipant | undefined = item.participants?.find(
    (p) => p.meta?.location === "home",
  );
  const away: MatchParticipant | undefined = item.participants?.find(
    (p) => p.meta?.location === "away",
  );

  const { home: homeScore, away: awayScore } = extractFinalScore(item.scores);

  const startDate = new Date(item.starting_at_timestamp * 1000);

  const formattedDate = startDate.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const formattedTime = startDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isFinished = FINISHED_STATES.has(Number(item.state_id));

  return (
    <div className="border border-gray-700 rounded-xl shadow-md p-3 sm:p-4 w-full bg-zinc-900 text-white">
      {/* Date + heure + statut */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400">
          {formattedDate} · {formattedTime}
        </span>
        <span
          className={`ml-auto text-xs font-medium ${isFinished ? "text-gray-500" : "text-yellow-400"}`}
        >
          {isFinished ? "Terminé" : "À venir"}
        </span>
      </div>

      {/* Équipes + scores */}
      <div className="flex flex-col gap-2">
        {/* Équipe domicile */}
        <div className="flex items-center gap-3">
          {home && (
            <FavoriteButton
              teamId={home.id}
              teamName={home.name}
              competitionId={leagueId}
            />
          )}
          {home?.image_path ? (
            <img
              src={home.image_path}
              alt={home.short_code ?? home.name}
              className="w-7 h-7 rounded-full object-contain shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-700 shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium truncate">
            {home?.name || home?.short_code}
          </span>
          {isFinished && (
            <span className="text-lg font-bold tabular-nums">{homeScore}</span>
          )}
        </div>

        {/* Équipe extérieure */}
        <div className="flex items-center gap-3">
          {away && (
            <FavoriteButton
              teamId={away.id}
              teamName={away.name}
              competitionId={leagueId}
            />
          )}
          {away?.image_path ? (
            <img
              src={away.image_path}
              alt={away.short_code ?? away.name}
              className="w-7 h-7 rounded-full object-contain shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-700 shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium truncate">
            {away?.name || away?.short_code}
          </span>
          {isFinished && (
            <span className="text-lg font-bold tabular-nums">{awayScore}</span>
          )}
        </div>
      </div>
    </div>
  );
};
