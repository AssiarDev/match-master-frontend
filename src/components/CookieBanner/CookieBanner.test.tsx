import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CookieBanner } from "./CookieBanner";
import * as useCookieConsentModule from "../../hooks/useCookieConsent";

vi.mock("../../hooks/useCookieConsent", () => ({
  useCookieConsent: vi.fn(),
}));

const mockAccept = vi.fn();
const mockRefuse = vi.fn();

const setup = (showBanner: boolean) => {
  vi.mocked(useCookieConsentModule.useCookieConsent).mockReturnValue({
    showBanner,
    accept: mockAccept,
    refuse: mockRefuse,
  });
  return render(
    <MemoryRouter>
      <CookieBanner />
    </MemoryRouter>,
  );
};

describe("CookieBanner", () => {
  it("does not render the banner when showBanner is false", () => {
    setup(false);
    expect(screen.queryByText("Tout accepter")).not.toBeInTheDocument();
    expect(screen.queryByText("Refuser")).not.toBeInTheDocument();
  });

  it("renders the banner when showBanner is true", () => {
    setup(true);
    expect(screen.getByText("Tout accepter")).toBeInTheDocument();
    expect(screen.getByText("Refuser")).toBeInTheDocument();
  });

  it("calls accept when clicking 'Tout accepter'", () => {
    setup(true);
    fireEvent.click(screen.getByText("Tout accepter"));
    expect(mockAccept).toHaveBeenCalledOnce();
  });

  it("calls refuse when clicking 'Refuser'", () => {
    setup(true);
    fireEvent.click(screen.getByText("Refuser"));
    expect(mockRefuse).toHaveBeenCalledOnce();
  });
});
