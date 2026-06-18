import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Live } from "./Live";
import * as useLiveStreamModule from "@/hooks/useLiveStream";
import { MatchStateDeveloperName } from "@/types";
import type { LiveMatch } from "@/types";

vi.mock("@/hooks/useLiveStream", () => ({ useLiveStream: vi.fn() }));
vi.mock("./LiveMatchCard", () => ({
  LiveMatchCard: ({ match }: { match: LiveMatch }) => (
    <div data-testid="live-match-card">{match.id}</div>
  ),
}));

const mockHook = () => vi.mocked(useLiveStreamModule.useLiveStream);

const fakeMatch: LiveMatch = {
  id: 1,
  sport_id: 1,
  league_id: 271,
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
  length: 90,
  placeholder: false,
  has_odds: false,
  has_premium_odds: false,
  league: { id: 271, name: "Superliga", image_path: null },
  state: {
    id: 1,
    state: "inplay",
    name: "1st Half",
    short_name: "1H",
    developer_name: MatchStateDeveloperName.INPLAY_FIRST_HALF,
  },
};

beforeEach(() => {
  mockHook().mockReturnValue({ matches: [], connected: false, error: null });
});

describe("Live", () => {
  it("shows 'Connexion...' status when not connected", () => {
    render(<Live />);
    expect(screen.getByText("Connexion...")).toBeInTheDocument();
  });

  it("shows 'Connecté' status when the stream is connected", () => {
    mockHook().mockReturnValue({ matches: [], connected: true, error: null });
    render(<Live />);
    expect(screen.getByText("Connecté")).toBeInTheDocument();
  });

  it("shows a waiting message when not connected and no error", () => {
    render(<Live />);
    expect(
      screen.getByText("Connexion au flux en direct..."),
    ).toBeInTheDocument();
  });

  it("displays the error message when there is a stream error", () => {
    mockHook().mockReturnValue({
      matches: [],
      connected: false,
      error: "Connexion perdue",
    });
    render(<Live />);
    expect(screen.getByText("Connexion perdue")).toBeInTheDocument();
  });

  it("shows 'Aucun match en direct' when connected but no active matches", () => {
    mockHook().mockReturnValue({ matches: [], connected: true, error: null });
    render(<Live />);
    expect(
      screen.getByText("Aucun match en direct pour le moment."),
    ).toBeInTheDocument();
  });

  it("renders a LiveMatchCard for each active match", () => {
    mockHook().mockReturnValue({
      matches: [fakeMatch],
      connected: true,
      error: null,
    });
    render(<Live />);
    expect(screen.getAllByTestId("live-match-card")).toHaveLength(1);
  });

  it("groups matches under their league name", () => {
    mockHook().mockReturnValue({
      matches: [fakeMatch],
      connected: true,
      error: null,
    });
    render(<Live />);
    expect(screen.getByText("Superliga")).toBeInTheDocument();
  });

  it("filters out matches that are not in an active state", () => {
    const finishedMatch: LiveMatch = {
      ...fakeMatch,
      id: 2,
      state: {
        id: 5,
        state: "finished",
        name: "Full Time",
        short_name: "FT",
        developer_name: "FT" as MatchStateDeveloperName,
      },
    };
    mockHook().mockReturnValue({
      matches: [finishedMatch],
      connected: true,
      error: null,
    });
    render(<Live />);
    expect(screen.queryByTestId("live-match-card")).not.toBeInTheDocument();
    expect(
      screen.getByText("Aucun match en direct pour le moment."),
    ).toBeInTheDocument();
  });

  it("groups two matches from the same league under one heading", () => {
    const match2: LiveMatch = { ...fakeMatch, id: 2 };
    mockHook().mockReturnValue({
      matches: [fakeMatch, match2],
      connected: true,
      error: null,
    });
    render(<Live />);
    expect(screen.getAllByText("Superliga")).toHaveLength(1);
    expect(screen.getAllByTestId("live-match-card")).toHaveLength(2);
  });

  it("uses 'Compétition inconnue' when the match has no league", () => {
    const matchWithoutLeague: LiveMatch = {
      ...fakeMatch,
      id: 3,
      league: undefined,
    };
    mockHook().mockReturnValue({
      matches: [matchWithoutLeague],
      connected: true,
      error: null,
    });
    render(<Live />);
    expect(screen.getByText("Compétition inconnue")).toBeInTheDocument();
  });
});
