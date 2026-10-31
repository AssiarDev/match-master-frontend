import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFoundPage } from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("displays the not found message", () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole("heading", { name: "Page non trouvée" }),
    ).toBeInTheDocument();
  });
});
