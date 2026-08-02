import type { Match, MatchParticipant } from "../../types";
import { FINISHED_STATES, extractFinalScore } from "../../utils/matchUtils";
import { BRACKET_CARD_H } from "../../utils/constants";

const TeamRow = ({
  team,
  score,
  winner,
  showScore,
}: {
  team?: MatchParticipant;
  score?: number;
  winner?: boolean;
  showScore: boolean;
}) => (
  <div
    className={`flex items-center gap-2 px-2 ${winner ? "text-zinc-100" : "text-zinc-400"}`}
    style={{ height: BRACKET_CARD_H / 2 }}
  >
    {team?.image_path ? (
      <img
        src={team.image_path}
        alt={team.short_code ?? team.name}
        className="w-5 h-5 object-contain shrink-0"
      />
    ) : (
      <div className="w-5 h-5 rounded-full bg-zinc-700 shrink-0" />
    )}
    <span className="flex-1 text-xs font-medium truncate">
      {team?.short_code ?? team?.name ?? "—"}
    </span>
    {showScore && (
      <span
        className={`text-xs font-bold tabular-nums ${winner ? "text-amber-400" : ""}`}
      >
        {score}
      </span>
    )}
  </div>
);

export const BracketMatchCard = ({
  match,
  cardW,
}: {
  match: Match;
  cardW: number;
}) => {
  const home = match.participants?.find((p) => p.meta?.location === "home");
  const away = match.participants?.find((p) => p.meta?.location === "away");
  const isFinished = FINISHED_STATES.has(Number(match.state_id));
  const { home: hs, away: as_ } = extractFinalScore(match.scores);

  return (
    <div
      className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shrink-0"
      style={{ width: cardW, height: BRACKET_CARD_H }}
    >
      <TeamRow
        team={home}
        score={hs}
        winner={isFinished && hs > as_}
        showScore={isFinished}
      />
      <div className="border-t border-zinc-700" />
      <TeamRow
        team={away}
        score={as_}
        winner={isFinished && as_ > hs}
        showScore={isFinished}
      />
    </div>
  );
};
