import type { LiveMatch, LiveParticipant, LiveScore, Period } from "@/types";
import { STATE_LABELS } from "@/utils/constants";
import { Card } from "@/components/UI/Card/Card";

const extractCurrentScore = (
  scores: LiveScore[] = [],
): { home: number; away: number } => {
  const current = scores.filter((s) => s.description === "CURRENT");
  let home = 0;
  let away = 0;
  current.forEach((s) => {
    if (s.score.participant === "home") home = s.score.goals;
    if (s.score.participant === "away") away = s.score.goals;
  });
  return { home, away };
};

/** Returns the current game time label (e.g. "46'", "45+3'") from the active period. */
const getGameTime = (periods: Period[] = []): string | null => {
  const active = periods.find((p) => p.ticking);
  if (!active) return null;
  if (active.time_added > 0)
    return `${active.period_length}+${active.time_added}'`;
  return `${active.minutes}'`;
};

export const LiveMatchCard = ({ match }: { match: LiveMatch }) => {
  const home: LiveParticipant | undefined = match.participants?.find(
    (p) => p.meta.location === "home",
  );
  const away: LiveParticipant | undefined = match.participants?.find(
    (p) => p.meta.location === "away",
  );
  const { home: homeScore, away: awayScore } = extractCurrentScore(
    match.scores,
  );
  const devName = match.state?.developer_name;
  const stateLabel = devName ? (STATE_LABELS[devName] ?? "LIVE") : "LIVE";
  const gameTime = getGameTime(match.periods);

  return (
    <Card>
      {/* Période + minute */}
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>
        <span className="text-xs font-medium text-zinc-300">{stateLabel}</span>
        {gameTime && (
          <span className="ml-auto text-xs font-bold text-red-400 tabular-nums">
            {gameTime}
          </span>
        )}
      </div>

      {/* Équipes + scores */}
      <div className="flex flex-col gap-2">
        {/* Équipe domicile */}
        <div className="flex items-center gap-3">
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
            {home?.short_code || home?.name}
          </span>
          <span className="text-lg font-bold tabular-nums">{homeScore}</span>
        </div>

        {/* Équipe extérieure */}
        <div className="flex items-center gap-3">
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
            {away?.short_code || away?.name}
          </span>
          <span className="text-lg font-bold tabular-nums">{awayScore}</span>
        </div>
      </div>
    </Card>
  );
};
