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

  it("places each match in the correct group", () => {
    const matches = [
      makeMatch(1, "2025-01-10 20:00:00"),
      makeMatch(2, "2025-02-14 18:00:00"),
      makeMatch(3, "2025-01-25 21:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    const keys = Object.keys(result);
    const janKey = keys.find((k) => result[k].some((m) => m.id === 1))!;
    const febKey = keys.find((k) => result[k].some((m) => m.id === 2))!;
    expect(janKey).not.toBe(febKey);
    expect(result[janKey].map((m) => m.id)).toEqual([1, 3]);
    expect(result[febKey].map((m) => m.id)).toEqual([2]);
  });

  it("preserves insertion order within a group", () => {
    const matches = [
      makeMatch(3, "2025-06-01 10:00:00"),
      makeMatch(1, "2025-06-15 20:00:00"),
      makeMatch(2, "2025-06-28 18:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    const keys = Object.keys(result);
    expect(result[keys[0]].map((m) => m.id)).toEqual([3, 1, 2]);
  });

  it("handles a single match", () => {
    const matches = [makeMatch(42, "2025-07-04 12:00:00")];
    const result = groupMatchesByMonth(matches);
    const keys = Object.keys(result);
    expect(keys).toHaveLength(1);
    expect(result[keys[0]]).toHaveLength(1);
    expect(result[keys[0]][0].id).toBe(42);
  });

  it("does not mutate the original match objects", () => {
    const match = makeMatch(1, "2025-03-10 20:00:00");
    const original = { ...match };
    groupMatchesByMonth([match]);
    expect(match).toEqual(original);
  });

  it("groups correctly when matches are in non-chronological order", () => {
    const matches = [
      makeMatch(3, "2025-03-05 21:00:00"),
      makeMatch(1, "2025-01-10 20:00:00"),
      makeMatch(2, "2025-01-25 18:00:00"),
    ];
    const result = groupMatchesByMonth(matches);
    expect(Object.keys(result)).toHaveLength(2);
    const janKey = Object.keys(result).find((k) =>
      result[k].some((m) => m.id === 1),
    )!;
    expect(result[janKey].map((m) => m.id)).toEqual([1, 2]);
  });
});
