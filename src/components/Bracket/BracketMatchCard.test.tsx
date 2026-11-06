import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BracketMatchCard } from "./BracketMatchCard";
import type { Match } from "@/types";

const score = (participant: "home" | "away", goals: number) => ({
  score: { participant, goals },
});

const match = (state_id: number): Match =>
  ({
    id: 1,
    starting_at: "2026-01-01 20:00:00",
    starting_at_timestamp: 1767297600,
    state_id,
    participants: [
      { id: 10, name: "Arsenal", meta: { location: "home" } },
      { id: 20, name: "Chelsea", meta: { location: "away" } },
    ],
    scores: [score("home", 2), score("away", 1)],
  }) as unknown as Match;

describe("BracketMatchCard", () => {
  it("shows the score of a finished match", () => {
    render(<BracketMatchCard match={match(5)} cardW={200} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it.each([
    [6, "extra time in progress"],
    [12, "cancelled"],
  ])("hides the score for state_id %i (%s)", (stateId) => {
    render(<BracketMatchCard match={match(stateId)} cardW={200} />);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
