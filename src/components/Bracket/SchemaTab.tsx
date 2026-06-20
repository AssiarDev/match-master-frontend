import { Fragment } from "react";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import {
  toFrenchRoundLabel,
  BRACKET_CARD_W,
  BRACKET_CARD_W_SM,
  BRACKET_BASE_GAP,
  BRACKET_UNIT,
  BRACKET_CONNECTOR_W,
  BRACKET_CONNECTOR_W_SM,
  BRACKET_LABEL_H,
} from "../../utils/constants";
import { BracketMatchCard } from "./BracketMatchCard";
import { BracketConnector } from "./BracketConnector";
import { reorderBracketStages } from "../../utils/reorderBracketStages";
import type { StageGroup } from "../../utils/groupMatchesByStage";

export const SchemaTab = ({ stages }: { stages: StageGroup[] }) => {
  const isSmall = useIsSmallScreen();
  const cardW = isSmall ? BRACKET_CARD_W_SM : BRACKET_CARD_W;
  const connectorW = isSmall ? BRACKET_CONNECTOR_W_SM : BRACKET_CONNECTOR_W;

  const sorted = reorderBracketStages(stages);
  const stage0Count = sorted[0].matches.length;
  const bracketH =
    BRACKET_LABEL_H + stage0Count * BRACKET_UNIT - BRACKET_BASE_GAP;

  return (
    <div className="overflow-x-auto pb-4 py-2">
      <div
        className="flex items-start mx-auto w-fit"
        style={{ height: bracketH }}
      >
        {sorted.map((stage, si) => {
          const paddingTop = ((Math.pow(2, si) - 1) * BRACKET_UNIT) / 2;
          const gap = BRACKET_BASE_GAP + (Math.pow(2, si) - 1) * BRACKET_UNIT;

          return (
            <Fragment key={stage.name}>
              <div className="flex flex-col shrink-0" style={{ width: cardW }}>
                <div
                  className="flex items-center justify-center"
                  style={{ height: BRACKET_LABEL_H }}
                >
                  <span className="text-amber-400 text-xs font-semibold whitespace-nowrap">
                    {toFrenchRoundLabel(stage.name, stage.matches.length)}
                  </span>
                </div>
                <div className="flex flex-col" style={{ paddingTop, gap }}>
                  {stage.matches.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                      cardW={cardW}
                    />
                  ))}
                </div>
              </div>

              {si < sorted.length - 1 && (
                <BracketConnector
                  stageIndex={si}
                  stage0Count={stage0Count}
                  connectorW={connectorW}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
