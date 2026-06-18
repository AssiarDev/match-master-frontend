import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GroupedMatchesList } from "./GroupedMatchesList";
import type { Match } from "../../types";

vi.mock("./MonthGroup", () => ({
  Monthgroup: ({ label }: { label: string }) => <section>{label}</section>,
}));

const fakeMatch: Match = {
  id: 1,
  starting_at: "2025-03-15 20:00:00",
  starting_at_timestamp: 1741982400,
  state_id: 5,
  participants: [],
  scores: [],
};

describe("GroupedMatchesList", () => {
  it("shows an empty state message when there are no matches", () => {
    render(<GroupedMatchesList groupedMatches={{}} />);
    expect(
      screen.getByText("Aucun match disponible pour cette catégorie."),
    ).toBeInTheDocument();
  });

  it("shows an empty state message when groupedMatches is null", () => {
    render(<GroupedMatchesList groupedMatches={null as never} />);
    expect(
      screen.getByText("Aucun match disponible pour cette catégorie."),
    ).toBeInTheDocument();
  });

  it("renders a section for each month group", () => {
    const grouped = {
      "Mars 2025": [fakeMatch],
      "Avril 2025": [{ ...fakeMatch, id: 2 }],
    };
    render(<GroupedMatchesList groupedMatches={grouped} />);
    expect(screen.getByText("Mars 2025")).toBeInTheDocument();
    expect(screen.getByText("Avril 2025")).toBeInTheDocument();
  });

  it("does not show the empty state when matches are present", () => {
    render(
      <GroupedMatchesList groupedMatches={{ "Mars 2025": [fakeMatch] }} />,
    );
    expect(
      screen.queryByText("Aucun match disponible pour cette catégorie."),
    ).not.toBeInTheDocument();
  });
});
