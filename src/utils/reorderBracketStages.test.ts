import { describe, it, expect } from "vitest";
import { reorderBracketStages } from "./reorderBracketStages";
import type { StageGroup } from "./groupMatchesByStage";
import type { Match } from "../types";

const makeMatch = (
  id: number,
  participants: Match["participants"] = [],
): Match => ({
  id,
  starting_at: "2025-08-16 14:00:00",
  starting_at_timestamp: 0,
  state_id: 5,
  participants,
});

const won = (id: number, name: string) => ({
  id,
  name,
  meta: { location: "home" as const, winner: true },
});
const lost = (id: number, name: string) => ({
  id,
  name,
  meta: { location: "away" as const, winner: false },
});
const pending = (id: number, name: string) => ({
  id,
  name,
  meta: { location: "home" as const },
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe("reorderBracketStages — edge cases", () => {
  it("returns an empty array unchanged", () => {
    expect(reorderBracketStages([])).toEqual([]);
  });

  it("returns a single stage unchanged (nothing to reorder)", () => {
    const stages: StageGroup[] = [
      { name: "Final", matches: [makeMatch(1), makeMatch(2)] },
    ];
    expect(reorderBracketStages(stages)).toEqual(stages);
  });
});

// ── Match alignment ───────────────────────────────────────────────────────────

describe("reorderBracketStages — match alignment against the draw", () => {
  it("places QF matches in the order dictated by the SF draw", () => {
    // Scenario: 4 QF matches, 2 SF matches
    // SF1 faces the winners of QF1 and QF2
    // SF2 faces the winners of QF3 and QF4
    // SportMonks returns QFs in the wrong order: [QF3, QF1, QF4, QF2]
    // After reorder: [QF1, QF2, QF3, QF4]
    // (each QF pair aligns under its corresponding semi-final)
    const teamA = won(1, "A"),
      teamB = lost(2, "B");
    const teamC = won(3, "C"),
      teamD = lost(4, "D");
    const teamE = won(5, "E"),
      teamF = lost(6, "F");
    const teamG = won(7, "G"),
      teamH = lost(8, "H");

    const qf1 = makeMatch(11, [teamA, teamB]);
    const qf2 = makeMatch(12, [teamC, teamD]);
    const qf3 = makeMatch(13, [teamE, teamF]);
    const qf4 = makeMatch(14, [teamG, teamH]);

    // SF1: A (won qf1) vs C (won qf2)
    const sf1 = makeMatch(21, [
      { id: 1, name: "A", meta: { location: "home" } },
      { id: 3, name: "C", meta: { location: "away" } },
    ]);
    // SF2: E (won qf3) vs G (won qf4)
    const sf2 = makeMatch(22, [
      { id: 5, name: "E", meta: { location: "home" } },
      { id: 7, name: "G", meta: { location: "away" } },
    ]);

    const stages: StageGroup[] = [
      { name: "Semi-finals", matches: [sf1, sf2] },
      // QFs in the wrong order
      { name: "Quarter-finals", matches: [qf3, qf1, qf4, qf2] },
    ];

    const result = reorderBracketStages(stages);
    const qf = result.find((s) => s.name === "Quarter-finals")!;

    // First two QFs must feed SF1 (teams 1 and 3)
    const firstPair = qf.matches.slice(0, 2).map((m) => m.id);
    expect(firstPair).toContain(qf1.id); // winner A → SF1
    expect(firstPair).toContain(qf2.id); // winner C → SF1

    // Next two QFs must feed SF2 (teams 5 and 7)
    const secondPair = qf.matches.slice(2, 4).map((m) => m.id);
    expect(secondPair).toContain(qf3.id); // winner E → SF2
    expect(secondPair).toContain(qf4.id); // winner G → SF2
  });

  it("sorts stages by descending match count (earliest round has the most matches)", () => {
    // If stages are passed in the wrong order they must still be processed
    // from the earliest round toward the final
    const sf = makeMatch(1, [won(1, "A"), lost(2, "B")]);
    const final_ = makeMatch(2, [
      { id: 1, name: "A", meta: { location: "home" } },
      { id: 99, name: "TBD", meta: { location: "away" } },
    ]);

    // Passed in reverse order (final before SF) — must still not throw
    const stages: StageGroup[] = [
      { name: "Final", matches: [final_] }, // 1 match
      { name: "Semi-final", matches: [sf] }, // 1 match (degenerate but must not crash)
    ];

    expect(() => reorderBracketStages(stages)).not.toThrow();
  });
});

// ── Matches without a winner ──────────────────────────────────────────────────

describe("reorderBracketStages — matches without a winner", () => {
  it("appends unresolved matches at the end of the stage (draw not yet played)", () => {
    // QF1 played: A wins
    // QF2 not yet played: no winner
    // SF: A vs TBD
    const qfPlayed = makeMatch(10, [won(1, "A"), lost(2, "B")]);
    const qfPending = makeMatch(20, [pending(5, "E"), pending(6, "F")]);

    const sf = makeMatch(30, [
      { id: 1, name: "A", meta: { location: "home" } },
      { id: 99, name: "TBD", meta: { location: "away" } },
    ]);

    const stages: StageGroup[] = [
      { name: "Semi-final", matches: [sf] },
      { name: "Quarter-finals", matches: [qfPending, qfPlayed] }, // intentionally scrambled
    ];

    const result = reorderBracketStages(stages);
    const qf = result.find((s) => s.name === "Quarter-finals")!;

    // The resolved match (feeding into SF) must come first
    expect(qf.matches[0].id).toBe(10);
    // The unresolved match must be at the end
    expect(qf.matches[qf.matches.length - 1].id).toBe(20);
  });

  it("does not modify the last stage (final remains unchanged)", () => {
    const final_ = makeMatch(1, [won(10, "PSG"), lost(20, "Bayern")]);
    const sf = makeMatch(2, [won(10, "PSG"), lost(30, "Real")]);

    const stages: StageGroup[] = [
      { name: "Final", matches: [final_] },
      { name: "Semi-final", matches: [sf] },
    ];

    const result = reorderBracketStages(stages);
    const finalStage = result.find((s) => s.name === "Final")!;

    expect(finalStage.matches).toEqual([final_]);
  });
});
