import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveMatchCard } from "./LiveMatchCard";
import type { LiveMatch, Period } from "@/types";
import { MatchStateDeveloperName, ScoreDescription } from "@/types";

const makePeriod = (overrides: Partial<Period> = {}): Period => ({
  id: 1,
  fixture_id: 1,
  type_id: 1,
  sort_order: 1,
  description: "1st Half",
  period_length: 45,
  counts_from: 0,
  has_timer: true,
  ticking: false,
  minutes: 0,
  seconds: 0,
  time_added: 0,
  started: null,
  ended: null,
  ...overrides,
});

const baseMatch: LiveMatch = {
  id: 1,
  sport_id: 1,
  league_id: 1,
  season_id: 1,
  stage_id: 1,
  group_id: null,
  aggregate_id: null,
  round_id: null,
  state_id: 1,
  venue_id: null,
  name: null,
  starting_at: null,
  starting_at_timestamp: 0,
  result_info: null,
  leg: "1",
  details: null,
  length: null,
  placeholder: false,
  has_odds: false,
  has_premium_odds: false,
  participants: [
    {
      id: 1,
      name: "Paris SG",
      short_code: "PSG",
      image_path: null,
      meta: { location: "home", winner: false, position: null },
    },
    {
      id: 2,
      name: "Olympique de Marseille",
      short_code: "OM",
      image_path: null,
      meta: { location: "away", winner: false, position: null },
    },
  ],
  scores: [
    {
      id: 1,
      fixture_id: 1,
      type_id: 1,
      participant_id: 1,
      description: ScoreDescription.CURRENT,
      score: { goals: 2, participant: "home" },
    },
    {
      id: 2,
      fixture_id: 1,
      type_id: 1,
      participant_id: 2,
      description: ScoreDescription.CURRENT,
      score: { goals: 1, participant: "away" },
    },
  ],
  state: {
    id: 3,
    state: "INPLAY_1ST_HALF",
    name: "1ère mi-temps",
    short_name: "1H",
    developer_name: MatchStateDeveloperName.INPLAY_FIRST_HALF,
  },
  periods: [],
};

describe("LiveMatchCard", () => {
  it("renders team short codes", () => {
    render(<LiveMatchCard match={baseMatch} />);
    expect(screen.getByText("PSG")).toBeInTheDocument();
    expect(screen.getByText("OM")).toBeInTheDocument();
  });

  it("renders the CURRENT scores", () => {
    render(<LiveMatchCard match={baseMatch} />);
    const scores = screen.getAllByText(/^[0-9]+$/);
    const values = scores.map((el) => el.textContent);
    expect(values).toContain("2");
    expect(values).toContain("1");
  });

  it("renders 0-0 when no scores provided", () => {
    render(<LiveMatchCard match={{ ...baseMatch, scores: [] }} />);
    const scores = screen.getAllByText("0");
    expect(scores).toHaveLength(2);
  });

  it("renders the state label for first half", () => {
    render(<LiveMatchCard match={baseMatch} />);
    expect(screen.getByText("1ère mi-temps")).toBeInTheDocument();
  });

  it("renders 'LIVE' when state is undefined", () => {
    render(<LiveMatchCard match={{ ...baseMatch, state: undefined }} />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("renders the game time from a ticking period", () => {
    const match: LiveMatch = {
      ...baseMatch,
      periods: [makePeriod({ ticking: true, minutes: 37, time_added: 0 })],
    };
    render(<LiveMatchCard match={match} />);
    expect(screen.getByText("37'")).toBeInTheDocument();
  });

  it("renders added time when time_added is set", () => {
    const match: LiveMatch = {
      ...baseMatch,
      periods: [
        makePeriod({ ticking: true, period_length: 45, time_added: 3 }),
      ],
    };
    render(<LiveMatchCard match={match} />);
    expect(screen.getByText("45+3'")).toBeInTheDocument();
  });

  it("does not render a game time when no period is ticking", () => {
    const match: LiveMatch = {
      ...baseMatch,
      periods: [makePeriod({ ticking: false, minutes: 45 })],
    };
    render(<LiveMatchCard match={match} />);
    expect(screen.queryByText(/'/)).not.toBeInTheDocument();
  });

  it("renders team name when short_code is null", () => {
    const match: LiveMatch = {
      ...baseMatch,
      participants: baseMatch.participants!.map((p) => ({
        ...p,
        short_code: null,
      })),
    };
    render(<LiveMatchCard match={match} />);
    expect(screen.getByText("Paris SG")).toBeInTheDocument();
    expect(screen.getByText("Olympique de Marseille")).toBeInTheDocument();
  });
});
