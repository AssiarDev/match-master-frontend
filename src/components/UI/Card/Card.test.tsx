import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <span>content</span>
      </Card>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("merges an extra className with the base surface classes", () => {
    render(<Card className="extra-class">content</Card>);
    const el = screen.getByText("content");
    expect(el.className).toContain("bg-zinc-900");
    expect(el.className).toContain("extra-class");
  });
});
