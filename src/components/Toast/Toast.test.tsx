import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("displays the message when show is true", () => {
    render(<Toast message="Opération réussie" show={true} />);
    expect(screen.getByText("Opération réussie")).toBeInTheDocument();
  });

  it("does not display the message when show is false", () => {
    render(<Toast message="Opération réussie" show={false} />);
    expect(screen.queryByText("Opération réussie")).not.toBeInTheDocument();
  });
});
