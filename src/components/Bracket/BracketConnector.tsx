import {
  BRACKET_CARD_H,
  BRACKET_BASE_GAP,
  BRACKET_UNIT,
  BRACKET_LABEL_H,
} from "../../utils/constants";

/**
 * Y-centre of match j in stage si relative to the bracket container top.
 * BRACKET_LABEL_H is added because each column starts with a fixed-height label
 * before the padded card area.
 */
const matchCenterY = (si: number, j: number): number => {
  const paddingTop = ((Math.pow(2, si) - 1) * BRACKET_UNIT) / 2;
  const gap = BRACKET_BASE_GAP + (Math.pow(2, si) - 1) * BRACKET_UNIT;
  return (
    BRACKET_LABEL_H +
    paddingTop +
    j * (BRACKET_CARD_H + gap) +
    BRACKET_CARD_H / 2
  );
};

export const BracketConnector = ({
  stageIndex: si,
  stage0Count,
  connectorW,
}: {
  stageIndex: number;
  stage0Count: number;
  connectorW: number;
}) => {
  const totalH =
    BRACKET_LABEL_H + stage0Count * BRACKET_UNIT - BRACKET_BASE_GAP;
  const matchCount = Math.round(stage0Count / Math.pow(2, si));
  const pairCount = Math.floor(matchCount / 2);
  const xMid = connectorW / 2;

  return (
    <svg width={connectorW} height={totalH} className="shrink-0">
      <g stroke="#3f3f46" strokeWidth="1.5" fill="none" strokeLinecap="round">
        {Array.from({ length: pairCount }).map((_, j) => {
          const y1 = matchCenterY(si, 2 * j);
          const y2 = matchCenterY(si, 2 * j + 1);
          const yMid = (y1 + y2) / 2;
          return (
            <g key={j}>
              <line x1={0} y1={y1} x2={xMid} y2={y1} />
              <line x1={0} y1={y2} x2={xMid} y2={y2} />
              <line x1={xMid} y1={y1} x2={xMid} y2={y2} />
              <line x1={xMid} y1={yMid} x2={connectorW} y2={yMid} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
