export type MatchStatus =
  | "upcoming"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

const STATE_IDS_BY_STATUS: Record<MatchStatus, number[]> = {
  upcoming: [1, 13, 16, 26],
  live: [2, 3, 4, 6, 9, 18, 21, 22, 23, 25],
  finished: [5, 7, 8, 14, 17, 19],
  postponed: [10, 11],
  cancelled: [12, 15, 20],
};

const STATUS_BY_STATE_ID = new Map<number, MatchStatus>(
  (Object.entries(STATE_IDS_BY_STATUS) as [MatchStatus, number[]][]).flatMap(
    ([status, stateIds]) =>
      stateIds.map((stateId): [number, MatchStatus] => [stateId, status]),
  ),
);

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  upcoming: "À venir",
  live: "En cours",
  finished: "Terminé",
  postponed: "Reporté",
  cancelled: "Annulé",
};

/**
 * Maps a SportMonks `state_id` to the status shown in the app.
 *
 * `state_id` is the only state field present on every match route:
 * `state.developer_name` only comes with the live stream. An unknown id falls
 * back to `upcoming`, so a new SportMonks state never displays a score.
 *
 * @param stateId - SportMonks fixture state id
 * @returns The match status
 * @see https://docs.sportmonks.com/v3/definitions/states
 */
export const getMatchStatus = (stateId: number | string): MatchStatus =>
  STATUS_BY_STATE_ID.get(Number(stateId)) ?? "upcoming";
