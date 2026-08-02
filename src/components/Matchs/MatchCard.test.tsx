import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import { MatchCard } from "./MatchCard";
import type { Match } from "@/types";

/** Wraps MatchCard with the providers required by FavoriteButton. */
const renderMatchCard = (match: Match, leagueId?: number) => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <MatchCard item={match} leagueId={leagueId} />
        </AuthProvider>
      ),
    },
  ]);
  return render(<RouterProvider router={router} />);
};

/** Waits for auth + favorites async effects to settle (avoids act() warnings). */
const settle = () =>
  waitFor(() => screen.getAllByRole("button").length > 0, { timeout: 2000 });

const baseMatch: Match = {
  id: 1,
  starting_at: "2025-01-10 20:00:00",
  starting_at_timestamp: 1736539200,
  state_id: 1,
  participants: [
    { id: 10, name: "Paris SG", meta: { location: "home" } },
    { id: 20, name: "Lyon", meta: { location: "away" } },
  ],
  scores: [],
};

describe("MatchCard", () => {
  it("renders home and away team names", async () => {
    renderMatchCard(baseMatch);
    await settle();
    expect(screen.getByText("Paris SG")).toBeInTheDocument();
    expect(screen.getByText("Lyon")).toBeInTheDocument();
  });

  it("shows 'À venir' for a non-finished match", async () => {
    renderMatchCard(baseMatch);
    await settle();
    expect(screen.getByText("À venir")).toBeInTheDocument();
  });

  it("shows 'Terminé' for a finished match (state_id 5)", async () => {
    renderMatchCard({ ...baseMatch, state_id: 5 });
    await settle();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
  });

  it("shows 'Terminé' for state_id 6 and 7", async () => {
    for (const state_id of [6, 7]) {
      const { unmount } = renderMatchCard({ ...baseMatch, state_id });
      await settle();
      expect(screen.getByText("Terminé")).toBeInTheDocument();
      unmount();
    }
  });

  it("displays scores when match is finished", async () => {
    const finished: Match = {
      ...baseMatch,
      state_id: 5,
      scores: [
        { score: { participant: "home", goals: 3 } },
        { score: { participant: "away", goals: 1 } },
      ],
    };
    renderMatchCard(finished);
    await settle();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not display scores when match is not finished", async () => {
    const upcoming: Match = {
      ...baseMatch,
      state_id: 1,
      scores: [
        { score: { participant: "home", goals: 2 } },
        { score: { participant: "away", goals: 0 } },
      ],
    };
    renderMatchCard(upcoming);
    await settle();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("handles scores in wrapped { data: [...] } shape", async () => {
    const finished: Match = {
      ...baseMatch,
      state_id: 5,
      scores: {
        data: [
          { score: { participant: "home", goals: 2 } },
          { score: { participant: "away", goals: 2 } },
        ],
      },
    };
    renderMatchCard(finished);
    await settle();
    const twos = screen.getAllByText("2");
    expect(twos).toHaveLength(2);
  });

  it("returns nothing when item is null", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: (
          <AuthProvider>
            <MatchCard item={null as unknown as Match} />
          </AuthProvider>
        ),
      },
    ]);
    const { container } = render(<RouterProvider router={router} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders placeholder when team has no image", async () => {
    renderMatchCard(baseMatch);
    await settle();
    // Teams have no image_path → grey placeholder divs
    const placeholders = document.querySelectorAll(".bg-zinc-700.rounded-full");
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });
});
