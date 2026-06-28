import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LiveStreamProvider, useLiveStreamContext } from "./LiveStreamContext";
import { MatchStateDeveloperName } from "@/types";

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

describe("LiveStreamContext", () => {
  it("throws when used outside LiveStreamProvider", () => {
    expect(() => renderHook(() => useLiveStreamContext())).toThrow(
      "useLiveStreamContext must be used inside LiveStreamProvider",
    );
  });

  it("provides hasLiveMatches=false when no matches have been received", () => {
    const { result } = renderHook(() => useLiveStreamContext(), {
      wrapper: LiveStreamProvider,
    });
    expect(result.current.hasLiveMatches).toBe(false);
  });

  it("sets hasLiveMatches=true when a match with an INPLAY state is received", () => {
    const { result } = renderHook(() => useLiveStreamContext(), {
      wrapper: LiveStreamProvider,
    });

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

    expect(result.current.hasLiveMatches).toBe(true);
  });

  it("keeps hasLiveMatches=false when all matches have a non-INPLAY state", () => {
    const { result } = renderHook(() => useLiveStreamContext(), {
      wrapper: LiveStreamProvider,
    });

    act(() => {
      fakeEs.onmessage!(
        new MessageEvent("message", {
          data: JSON.stringify([{ id: 1, state: { developer_name: "FT" } }]),
        }),
      );
    });

    expect(result.current.hasLiveMatches).toBe(false);
  });

  it("exposes the received matches through the context", () => {
    const { result } = renderHook(() => useLiveStreamContext(), {
      wrapper: LiveStreamProvider,
    });

    act(() => {
      fakeEs.onmessage!(
        new MessageEvent("message", {
          data: JSON.stringify([{ id: 42, state: null }]),
        }),
      );
    });

    expect(result.current.matches).toHaveLength(1);
    expect(result.current.matches[0].id).toBe(42);
  });
});
