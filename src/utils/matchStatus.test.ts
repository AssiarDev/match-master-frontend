import { describe, it, expect } from "vitest";
import {
  MATCH_STATUS_LABELS,
  getMatchStatus,
  type MatchStatus,
} from "./matchStatus";

describe("getMatchStatus", () => {
  it.each<[number, string, MatchStatus]>([
    [1, "NS", "upcoming"],
    [2, "INPLAY_1ST_HALF", "live"],
    [3, "HT", "live"],
    [4, "BREAK", "live"],
    [5, "FT", "finished"],
    [6, "INPLAY_ET", "live"],
    [7, "AET", "finished"],
    [8, "FT_PEN", "finished"],
    [9, "INPLAY_PENALTIES", "live"],
    [10, "POSTPONED", "postponed"],
    [11, "SUSPENDED", "postponed"],
    [12, "CANCELLED", "cancelled"],
    [13, "TBA", "upcoming"],
    [14, "WO", "finished"],
    [15, "ABANDONED", "cancelled"],
    [16, "DELAYED", "upcoming"],
    [17, "AWARDED", "finished"],
    [18, "INTERRUPTED", "live"],
    [19, "AWAITING_UPDATES", "finished"],
    [20, "DELETED", "cancelled"],
    [21, "EXTRA_TIME_BREAK", "live"],
    [22, "INPLAY_2ND_HALF", "live"],
    [23, "INPLAY_ET_2ND_HALF", "live"],
    [25, "PEN_BREAK", "live"],
    [26, "PENDING", "upcoming"],
  ])("maps state_id %i (%s) to %s", (stateId, _state, status) => {
    expect(getMatchStatus(stateId)).toBe(status);
  });

  it("accepts a state_id sent as a string", () => {
    expect(getMatchStatus("5")).toBe("finished");
  });

  it("treats an unknown state_id as upcoming", () => {
    expect(getMatchStatus(999)).toBe("upcoming");
  });
});

describe("MATCH_STATUS_LABELS", () => {
  it("has a French label for every status", () => {
    expect(MATCH_STATUS_LABELS).toEqual({
      upcoming: "À venir",
      live: "En cours",
      finished: "Terminé",
      postponed: "Reporté",
      cancelled: "Annulé",
    });
  });
});
