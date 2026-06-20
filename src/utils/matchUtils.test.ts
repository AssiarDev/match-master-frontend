import { describe, it, expect } from "vitest";
import {
  FINISHED_STATES,
  normalizeScores,
  extractFinalScore,
} from "./matchUtils";

// ── FINISHED_STATES ────────────────────────────────────────────────────────────
// Spec: a match is "finished" (displays "Terminé") when its state_id belongs
// to {5=FT, 6=INPLAY_ET, 7=AET, 8=FT_PEN, 12=ABD}.
// Regression: state_id 8 (FT_PEN) was missing, causing penalty-shootout matches
// to be displayed as "À venir" even after the season ended.

describe("FINISHED_STATES", () => {
  it.each([
    [5, "FT — full time"],
    [6, "INPLAY_ET — extra time in progress (must not show À venir)"],
    [7, "AET — finished after extra time"],
    [8, "FT_PEN — finished on penalties (regression: was missing)"],
    [12, "ABD — match abandoned"],
  ])("state_id %i (%s) is classified as finished", (stateId) => {
    expect(FINISHED_STATES.has(stateId)).toBe(true);
  });

  it.each([
    [1, "NS — not started"],
    [2, "INPLAY_1ST_HALF — first half in progress"],
    [3, "HT — half time"],
    [4, "INPLAY_2ND_HALF — second half in progress"],
  ])("state_id %i (%s) is not classified as finished", (stateId) => {
    expect(FINISHED_STATES.has(stateId)).toBe(false);
  });
});

// ── normalizeScores ────────────────────────────────────────────────────────────
// Spec: normalises the two score formats SportMonks may return.
// Format 1: direct array ScoreDetail[]
// Format 2: wrapped object { data: ScoreDetail[] }
// All other cases (null, undefined, object without data) → []

describe("normalizeScores", () => {
  it("returns [] for undefined", () => {
    expect(normalizeScores(undefined)).toEqual([]);
  });

  it("returns [] for null", () => {
    expect(normalizeScores(null as never)).toEqual([]);
  });

  it("returns [] for an object with no data property", () => {
    expect(normalizeScores({} as never)).toEqual([]);
  });

  it("returns the array as-is (direct ScoreDetail[] format)", () => {
    const scores = [
      { score: { participant: "home" as const, goals: 2 } },
      { score: { participant: "away" as const, goals: 1 } },
    ];
    expect(normalizeScores(scores)).toBe(scores); // same reference
  });

  it("unwraps the { data: [...] } format and returns its content", () => {
    const inner = [{ score: { participant: "home" as const, goals: 1 } }];
    const result = normalizeScores({ data: inner });
    expect(result).toEqual(inner);
  });

  it("returns [] for { data: [] }", () => {
    expect(normalizeScores({ data: [] })).toEqual([]);
  });
});

// ── extractFinalScore ──────────────────────────────────────────────────────────
// Spec: returns { home, away } with the final goal count for each team.
// SportMonks may return multiple entries per participant (1st half, 2nd half,
// current score…). We take the maximum to get the actual final score.

describe("extractFinalScore", () => {
  it("returns { home: 0, away: 0 } for an empty array", () => {
    expect(extractFinalScore([])).toEqual({ home: 0, away: 0 });
  });

  it("returns { home: 0, away: 0 } for undefined", () => {
    expect(extractFinalScore(undefined)).toEqual({ home: 0, away: 0 });
  });

  it("extracts home and away goals correctly", () => {
    const result = extractFinalScore([
      { score: { participant: "home", goals: 3 } },
      { score: { participant: "away", goals: 1 } },
    ]);
    expect(result).toEqual({ home: 3, away: 1 });
  });

  it("takes the maximum across multiple entries for the same participant (final score vs half-time)", () => {
    // SportMonks often returns one score per half plus a current score
    const result = extractFinalScore([
      { score: { participant: "home", goals: 1 } }, // 1st half
      { score: { participant: "home", goals: 3 } }, // final score
      { score: { participant: "away", goals: 0 } },
      { score: { participant: "away", goals: 2 } },
    ]);
    expect(result.home).toBe(3);
    expect(result.away).toBe(2);
  });

  it("treats 0 goals as a valid value (0-0 draw)", () => {
    const result = extractFinalScore([
      { score: { participant: "home", goals: 0 } },
      { score: { participant: "away", goals: 0 } },
    ]);
    expect(result).toEqual({ home: 0, away: 0 });
  });

  it("treats non-numeric goals as 0 (malformed data)", () => {
    const result = extractFinalScore([
      { score: { participant: "home", goals: "two" as never } },
      { score: { participant: "away", goals: 1 } },
    ]);
    expect(result).toEqual({ home: 0, away: 1 });
  });

  it("works with the wrapped { data: [...] } format", () => {
    const result = extractFinalScore({
      data: [
        { score: { participant: "home", goals: 2 } },
        { score: { participant: "away", goals: 2 } },
      ],
    });
    expect(result).toEqual({ home: 2, away: 2 });
  });

  it("ignores entries with a missing or null score object", () => {
    const result = extractFinalScore([
      null as never,
      { score: null as never },
      { score: { participant: "home", goals: 1 } },
      { score: { participant: "away", goals: 0 } },
    ]);
    expect(result).toEqual({ home: 1, away: 0 });
  });
});
