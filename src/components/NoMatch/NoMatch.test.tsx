import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoMatch } from "./NoMatch";

describe("NoMatch", () => {
  it("displays the not found message", () => {
    render(<NoMatch />);
    expect(
      screen.getByRole("heading", { name: "Page non trouvée" }),
    ).toBeInTheDocument();
  });
});
