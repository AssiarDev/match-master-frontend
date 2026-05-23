import { describe, it, expect } from "vitest";
import { groupMatchesByMonth } from "./groupMatchesByMonth";
import type { Match } from "../types";

const makeMatch = (id: number, starting_at: string): Match => ({
  id,
  starting_at,
  starting_at_timestamp: 0,
  state_id: 1,
});

describe("groupMatchesByMonth", () => {
  it("returns an empty object for an empty array", () => {
    expect(groupMatchesByMonth([])).toEqual({});
  });

  it("groups matches from the same month under the same key", () => {
    const matches = [
      makeMatch(1, "2025-01-10 20:00:00"),
      makeMatch(2, "2025-01-25 18:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    const keys = Object.keys(result);
    expect(keys).toHaveLength(1);
    expect(result[keys[0]]).toHaveLength(2);
  });

  it("creates separate keys for different months", () => {
    const matches = [
      makeMatch(1, "2025-01-10 20:00:00"),
      makeMatch(2, "2025-02-14 18:00:00"),
      makeMatch(3, "2025-03-05 21:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    expect(Object.keys(result)).toHaveLength(3);
  });

  it("creates separate keys for the same month in different years", () => {
    const matches = [
      makeMatch(1, "2024-01-10 20:00:00"),
      makeMatch(2, "2025-01-10 20:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    expect(Object.keys(result)).toHaveLength(2);
  });
});
