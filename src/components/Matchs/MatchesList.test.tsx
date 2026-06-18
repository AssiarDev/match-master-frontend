import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { MatchesList } from "./MatchesList";
import * as useFilteredMatchesByTeamModule from "@/hooks/useFilteredMatchesByTeam";
import type { Match } from "../../types";

vi.mock("@/hooks/useFilteredMatchesByTeam", () => ({
  useFilteredMatchesByTeam: vi.fn(),
}));
vi.mock("./GroupedMatchesList", () => ({
  GroupedMatchesList: ({
    groupedMatches,
  }: {
    groupedMatches: Record<string, unknown[]>;
  }) => (
    <div data-testid="grouped-matches">
      {Object.keys(groupedMatches).join(",")}
    </div>
  ),
}));

const fakeMatch: Match = {
  id: 1,
  starting_at: "2025-03-15 20:00:00",
  starting_at_timestamp: 1741982400,
  state_id: 5,
  participants: [],
  scores: [],
};

const mockHook = () =>
  vi.mocked(useFilteredMatchesByTeamModule.useFilteredMatchesByTeam);

const renderMatchesList = (selectedLeague = 1) => {
  const router = createMemoryRouter(
    [{ path: "/teams/:teamId/matches", element: <MatchesList /> }],
    {
      initialEntries: [
        { pathname: "/teams/10/matches", state: { selectedLeague } },
      ],
    },
  );
  return render(<RouterProvider router={router} />);
};

beforeEach(() => {
  mockHook().mockReturnValue([]);
});

describe("MatchesList", () => {
  it("renders both filter buttons", () => {
    renderMatchesList();
    expect(screen.getByRole("button", { name: "À venir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Terminé" })).toBeInTheDocument();
  });

  it("defaults to the 'upcoming' filter", () => {
    renderMatchesList();
    expect(mockHook()).toHaveBeenCalledWith(1, "10", "upcoming");
  });

  it("switches to 'finished' filter when clicking Terminé", () => {
    renderMatchesList();
    fireEvent.click(screen.getByRole("button", { name: "Terminé" }));
    expect(mockHook()).toHaveBeenCalledWith(1, "10", "finished");
  });

  it("passes the grouped matches to GroupedMatchesList", () => {
    mockHook().mockReturnValue([fakeMatch]);
    renderMatchesList();
    expect(screen.getByTestId("grouped-matches")).toBeInTheDocument();
  });

  it("passes the league id from location state to useFilteredMatchesByTeam", () => {
    renderMatchesList(99);
    expect(mockHook()).toHaveBeenCalledWith(99, "10", "upcoming");
  });
});
