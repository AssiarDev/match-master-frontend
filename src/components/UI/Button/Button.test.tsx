import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Se connecter</Button>);
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("forwards click handlers and native button props", () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" onClick={onClick}>
        Envoyer
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Envoyer" });
    expect(button).toHaveAttribute("type", "submit");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies the disabled state", () => {
    render(<Button disabled>Chargement...</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("merges an extra className with the base classes", () => {
    render(<Button className="extra-class">Envoyer</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-amber-600");
    expect(button.className).toContain("extra-class");
  });

  it("defaults to the primary (amber) variant", () => {
    render(<Button>Envoyer</Button>);
    expect(screen.getByRole("button").className).toContain("bg-amber-600");
  });

  it("applies the secondary (zinc) variant", () => {
    render(<Button variant="secondary">Refuser</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-zinc-700");
    expect(button.className).not.toContain("bg-amber-600");
  });

  it("applies the danger-outline variant", () => {
    render(<Button variant="danger-outline">Supprimer</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-red-500");
    expect(button.className).toContain("text-red-500");
  });
});
