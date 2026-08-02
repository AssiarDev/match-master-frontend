import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filtre } from "./Filtre";

describe("Filtre", () => {
  it("renders both filter buttons", () => {
    render(<Filtre activeFilter="upcoming" onFilterChange={vi.fn()} />);
    expect(screen.getByText("À venir")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();
  });

  it("calls onFilterChange with 'upcoming' when clicking 'À venir'", () => {
    const onFilterChange = vi.fn();
    render(<Filtre activeFilter="finished" onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText("À venir"));
    expect(onFilterChange).toHaveBeenCalledWith("upcoming");
  });

  it("calls onFilterChange with 'finished' when clicking 'Terminé'", () => {
    const onFilterChange = vi.fn();
    render(<Filtre activeFilter="upcoming" onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText("Terminé"));
    expect(onFilterChange).toHaveBeenCalledWith("finished");
  });

  it("applies active style to the current active filter button", () => {
    render(<Filtre activeFilter="upcoming" onFilterChange={vi.fn()} />);
    expect(screen.getByText("À venir").className).toContain("bg-amber-800");
    expect(screen.getByText("Terminé").className).not.toContain("bg-amber-800");
  });
});
