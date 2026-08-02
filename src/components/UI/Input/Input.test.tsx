import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("forwards native input props", () => {
    const onChange = vi.fn();
    render(<Input placeholder="Email" type="email" onChange={onChange} />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("type", "email");
    fireEvent.change(input, { target: { value: "a@b.com" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("uses the default border color when not in error state", () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.className).toContain("border-zinc-700");
    expect(input.className).not.toContain("border-red-500");
  });

  it("switches to the error border color when error is true", () => {
    render(<Input placeholder="Email" error />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.className).toContain("border-red-500");
  });

  it("merges an extra className with the base classes", () => {
    render(<Input placeholder="Email" className="extra-class" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.className).toContain("rounded-md");
    expect(input.className).toContain("extra-class");
  });
});
