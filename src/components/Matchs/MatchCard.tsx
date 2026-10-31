import type { Match, MatchParticipant } from "../../types";
import { FavoriteButton } from "../Favorite/FavoriteButton/FavoriteButton";
import { extractFinalScore } from "../../utils/matchUtils";
import {
  MATCH_STATUS_LABELS,
  getMatchStatus,
  type MatchStatus,
} from "../../utils/matchStatus";
import { MATCH_TIME_ZONE } from "../../utils/constants";
import { Card } from "../UI/Card/Card";

const STATUS_CLASSES: Record<MatchStatus, string> = {
  upcoming: "text-yellow-500",
  live: "text-red-400",
  finished: "text-zinc-500",
  postponed: "text-orange-400",
  cancelled: "text-zinc-400",
};

interface MatchCardProps {
  item: Match;
  leagueId?: number;
}

/**
 * Card displaying a match with home/away teams, status, score (if finished), and favorite buttons.
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
    timeZone: MATCH_TIME_ZONE,
  });

  const formattedTime = startDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: MATCH_TIME_ZONE,
  });

  const status = getMatchStatus(item.state_id);
  const isFinished = status === "finished";

  return (
    <Card>
      {/* Date + heure + statut */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-zinc-400">
          {formattedDate} · {formattedTime}
        </span>
        <span
          className={`ml-auto text-xs font-medium ${STATUS_CLASSES[status]}`}
        >
          {MATCH_STATUS_LABELS[status]}
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
            <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0" />
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
            <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium truncate">
            {away?.name || away?.short_code}
          </span>
          {isFinished && (
            <span className="text-lg font-bold tabular-nums">{awayScore}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
