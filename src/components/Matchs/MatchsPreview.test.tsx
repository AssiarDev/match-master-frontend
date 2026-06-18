import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatchsPreview } from "./MatchsPreview";
import type { Match } from "../../types";

vi.mock("./MatchCard", () => ({
  MatchCard: ({ item }: { item: Match }) => (
    <div data-testid="match-card">{item.id}</div>
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

describe("MatchsPreview", () => {
  it("shows an empty state message when there are no matches", () => {
    render(<MatchsPreview matchs={[]} onShowAll={vi.fn()} />);
    expect(
      screen.getByText("La compétition n'a pas encore démarré."),
    ).toBeInTheDocument();
  });

  it("shows an empty state message when matchs is null", () => {
    render(<MatchsPreview matchs={null as never} onShowAll={vi.fn()} />);
    expect(
      screen.getByText("La compétition n'a pas encore démarré."),
    ).toBeInTheDocument();
  });

  it("renders a MatchCard for each match", () => {
    const matchs = [fakeMatch, { ...fakeMatch, id: 2 }];
    render(<MatchsPreview matchs={matchs} onShowAll={vi.fn()} />);
    expect(screen.getAllByTestId("match-card")).toHaveLength(2);
  });

  it("shows the 'Derniers matchs' title when matches are present", () => {
    render(<MatchsPreview matchs={[fakeMatch]} onShowAll={vi.fn()} />);
    expect(screen.getByText("Derniers matchs")).toBeInTheDocument();
  });

  it("shows the 'Afficher tous les matchs' link when matches are present", () => {
    render(<MatchsPreview matchs={[fakeMatch]} onShowAll={vi.fn()} />);
    expect(screen.getByText("Afficher tous les matchs")).toBeInTheDocument();
  });

  it("calls onShowAll when clicking 'Afficher tous les matchs'", () => {
    const onShowAll = vi.fn();
    render(<MatchsPreview matchs={[fakeMatch]} onShowAll={onShowAll} />);
    fireEvent.click(screen.getByText("Afficher tous les matchs"));
    expect(onShowAll).toHaveBeenCalled();
  });
});
