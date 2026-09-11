import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchSkeleton, MatchSkeletonGrid } from "./MatchSkeleton";

describe("MatchSkeleton", () => {
  it("renders a pulsing placeholder card", () => {
    const { container } = render(<MatchSkeleton />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});

describe("MatchSkeletonGrid", () => {
  it("exposes a loading status to assistive technologies", () => {
    render(<MatchSkeletonGrid />);

    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Chargement des matchs",
    );
  });

  it("renders as many placeholder cards as requested", () => {
    render(<MatchSkeletonGrid count={3} />);

    expect(screen.getByRole("status").children).toHaveLength(3);
  });
});
