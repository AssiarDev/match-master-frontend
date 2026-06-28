import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LiveStreamProvider } from "@/context/LiveStreamContext";
import { MatchStateDeveloperName } from "@/types";
import { BottomNav } from "./BottomNav";

const makeFakeEventSource = () => ({
  onopen: null as ((event: Event) => void) | null,
  onmessage: null as ((event: MessageEvent) => void) | null,
  onerror: null as ((event: Event) => void) | null,
  close: vi.fn(),
});

let fakeEs: ReturnType<typeof makeFakeEventSource>;

beforeEach(() => {
  fakeEs = makeFakeEventSource();
  vi.stubGlobal(
    "EventSource",
    vi.fn(function () {
      return fakeEs;
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderNav = (
  path = "/",
  onSearchToggle = vi.fn(),
  isSearchOpen = false,
) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LiveStreamProvider>
        <BottomNav
          onSearchToggle={onSearchToggle}
          isSearchOpen={isSearchOpen}
        />
      </LiveStreamProvider>
    </MemoryRouter>,
  );

describe("BottomNav", () => {
  it("renders all four tabs", () => {
    renderNav();
    expect(screen.getByRole("button", { name: "Matchs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Favoris" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Live" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Recherche" }),
    ).toBeInTheDocument();
  });

  it("calls onSearchToggle when the search button is clicked", async () => {
    const user = userEvent.setup();
    const onSearchToggle = vi.fn();
    renderNav("/", onSearchToggle);
    await user.click(screen.getByRole("button", { name: "Recherche" }));
    expect(onSearchToggle).toHaveBeenCalledOnce();
  });

  it("scrolls to top when the already-active tab is clicked", async () => {
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const user = userEvent.setup();
    renderNav("/");
    await user.click(screen.getByRole("button", { name: "Matchs" }));
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    scrollSpy.mockRestore();
  });

  it("does not show the live dot when there are no live matches", () => {
    const { container } = renderNav();
    expect(container.querySelector(".bg-red-500")).toBeNull();
  });

  it("shows the live dot when a match with an INPLAY state is received", () => {
    const { container } = renderNav();

    act(() => {
      fakeEs.onmessage!(
        new MessageEvent("message", {
          data: JSON.stringify([
            {
              id: 1,
              state: {
                developer_name: MatchStateDeveloperName.INPLAY_FIRST_HALF,
              },
            },
          ]),
        }),
      );
    });

    expect(container.querySelector(".bg-red-500")).toBeInTheDocument();
  });

  it("applies the active style to the current route tab", () => {
    renderNav("/live");
    const liveButton = screen.getByRole("button", { name: "Live" });
    expect(liveButton).toHaveClass("text-red-400");
  });
});
