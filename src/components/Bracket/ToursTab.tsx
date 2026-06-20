import { useState } from "react";
import { MatchCard } from "../Matchs/MatchCard";
import { toFrenchRoundLabel } from "../../utils/constants";
import type { StageGroup } from "../../utils/groupMatchesByStage";

const ROUND_PREVIEW_COUNT = 6;

const RoundMatchList = ({
  stage,
  competitionId,
}: {
  stage: StageGroup;
  competitionId?: number;
}) => {
  const [visibleCount, setVisibleCount] = useState(ROUND_PREVIEW_COUNT);
  const visible = stage.matches.slice(0, visibleCount);
  const remaining = stage.matches.length - visibleCount;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wide">
          {toFrenchRoundLabel(stage.name, stage.matches.length)}
        </h3>
        {remaining > 0 && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setVisibleCount((n) => n + ROUND_PREVIEW_COUNT);
            }}
            className="text-blue-500 hover:underline text-sm"
          >
            Afficher plus ({remaining} autres)
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((match) => (
          <MatchCard key={match.id} item={match} leagueId={competitionId} />
        ))}
      </div>
    </div>
  );
};

export const ToursTab = ({
  stages,
  competitionId,
}: {
  stages: StageGroup[];
  competitionId?: number;
}) => (
  <div className="flex flex-col gap-8 py-2">
    {stages.map((stage) => (
      <RoundMatchList
        key={stage.name}
        stage={stage}
        competitionId={competitionId}
      />
    ))}
  </div>
);
