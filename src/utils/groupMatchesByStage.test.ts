import { describe, it, expect } from "vitest";
import { groupMatchesByStage } from "./groupMatchesByStage";
import type { Match, Stage } from "../types";

const makeMatch = (id: number): Match => ({
  id,
  starting_at: "2025-08-16 14:00:00",
  starting_at_timestamp: 0,
  state_id: 5,
});

describe("groupMatchesByStage", () => {
  it("returns an empty array when no stage has fixtures", () => {
    expect(groupMatchesByStage([])).toEqual([]);
    expect(groupMatchesByStage([{ name: "Tour 1" }])).toEqual([]);
  });

  it("groups direct fixtures (cup structure: Stage → fixtures)", () => {
    const data: Stage[] = [
      {
        name: "Extra Preliminary Round",
        fixtures: [makeMatch(1), makeMatch(2)],
      },
    ];
    const result = groupMatchesByStage(data);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Extra Preliminary Round");
    expect(result[0].matches.map((m) => m.id)).toEqual([1, 2]);
  });

  it("collects fixtures nested under rounds (Stage → rounds → fixtures)", () => {
    const data: Stage[] = [
      {
        name: "Preliminary Round",
        rounds: [
          { fixtures: [makeMatch(1), makeMatch(2)] },
          { fixtures: [makeMatch(3)] },
        ],
      },
    ];
    const result = groupMatchesByStage(data);
    expect(result).toHaveLength(1);
    expect(result[0].matches.map((m) => m.id)).toEqual([1, 2, 3]);
  });

  it("collects fixtures from deeply nested stages (Stage → stages → rounds → fixtures)", () => {
    const data: Stage[] = [
      {
        name: "1st Phase",
        stages: [{ rounds: [{ fixtures: [makeMatch(1)] }] }],
      },
    ];
    const result = groupMatchesByStage(data);
    expect(result).toHaveLength(1);
    expect(result[0].matches.map((m) => m.id)).toEqual([1]);
  });

  it("combines direct fixtures and round fixtures within the same stage", () => {
    const data: Stage[] = [
      {
        name: "Mixed",
        fixtures: [makeMatch(1)],
        rounds: [{ fixtures: [makeMatch(2)] }],
      },
    ];
    const result = groupMatchesByStage(data);
    expect(result[0].matches.map((m) => m.id)).toEqual([1, 2]);
  });

  it("drops stages with no fixtures but keeps populated ones", () => {
    const data: Stage[] = [
      { name: "Empty", rounds: [{ fixtures: [] }] },
      { name: "Populated", fixtures: [makeMatch(1)] },
    ];
    const result = groupMatchesByStage(data);
    expect(result.map((s) => s.name)).toEqual(["Populated"]);
  });

  it("falls back to 'Tour' when a stage has no name", () => {
    const result = groupMatchesByStage([{ fixtures: [makeMatch(1)] }]);
    expect(result[0].name).toBe("Tour");
  });

  it("accepts a single stage object (not wrapped in an array)", () => {
    const result = groupMatchesByStage({
      name: "Final",
      fixtures: [makeMatch(1)],
    });
    expect(result).toHaveLength(1);
    expect(result[0].matches).toHaveLength(1);
  });
});
