import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Competition } from "../../types";
import { CompetitionCard } from "./CompetitionCard";

const renderCard = (competition: Competition) =>
  render(
    <MemoryRouter>
      <CompetitionCard competition={competition} />
    </MemoryRouter>,
  );

describe("CompetitionCard", () => {
  it("renders the logo when the competition has an image_path", () => {
    renderCard({
      id: 8,
      name: "Premier League",
      image_path: "https://cdn.example.com/premier-league.png",
    });
    expect(screen.getByAltText("Logo de Premier League")).toHaveAttribute(
      "src",
      "https://cdn.example.com/premier-league.png",
    );
  });

  it("renders no image but keeps the name when image_path is missing", () => {
    renderCard({ id: 8, name: "Premier League" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Premier League")).toBeInTheDocument();
  });
});
