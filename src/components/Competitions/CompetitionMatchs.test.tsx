import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CompetitionMatchs } from "./CompetitionMatchs";
import * as useMatchesModule from "@/hooks/useMatches";
import type { Match } from "../../types";

vi.mock("@/hooks/useMatches", () => ({ useMatches: vi.fn() }));
vi.mock("../Matchs/MatchGroupByMonth", () => ({
  MatchGroupByMonth: ({ month }: { month: string }) => (
    <div data-testid="month-group">{month}</div>
  ),
}));

const mockHook = () => vi.mocked(useMatchesModule.useMatches);

const fakeMatch: Match = {
  id: 1,
  starting_at: "2025-03-15 20:00:00",
  starting_at_timestamp: 1741982400,
  state_id: 5,
  participants: [],
  scores: [],
};

const renderMatchs = (competitionId = 5) => {
  const router = createMemoryRouter(
    [{ path: "/competitions/:id/matches", element: <CompetitionMatchs /> }],
    {
      initialEntries: [
        {
          pathname: "/competitions/5/matches",
          state: { competition: { id: competitionId } },
        },
      ],
    },
  );
  return render(<RouterProvider router={router} />);
};

beforeEach(() => {
  mockHook().mockReturnValue({ matches: [], loading: false, error: null });
});

describe("CompetitionMatchs", () => {
  it("shows a loading message while fetching", () => {
    mockHook().mockReturnValue({
      matches: [],
      loading: true,
      error: null,
    });
    renderMatchs();
    expect(screen.getByText("Chargement des matchs...")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", () => {
    mockHook().mockReturnValue({
      matches: [],
      loading: false,
      error: "Erreur réseau",
    });
    renderMatchs();
    expect(screen.getByText("Erreur : Erreur réseau")).toBeInTheDocument();
  });

  it("shows 'Aucun match disponible' when there are no matches", () => {
    renderMatchs();
    expect(screen.getByText("Aucun match disponible.")).toBeInTheDocument();
  });

  it("renders a month group for each group returned by groupMatchesByMonth", () => {
    mockHook().mockReturnValue({
      matches: [
        fakeMatch,
        { ...fakeMatch, id: 2, starting_at: "2025-04-10 20:00:00" },
      ],
      loading: false,
      error: null,
    });
    renderMatchs();
    expect(screen.getAllByTestId("month-group")).toHaveLength(2);
  });

  it("passes the competition id from location state to useMatches", () => {
    renderMatchs(99);
    expect(mockHook()).toHaveBeenCalledWith(99);
  });
});
