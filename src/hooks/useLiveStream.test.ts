import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLiveStream } from "./useLiveStream";

const SSE = import.meta.env.VITE_SSE_URL ?? "http://localhost:3000";

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

describe("useLiveStream", () => {
  it("starts with connected=false, no matches and no error", () => {
    const { result } = renderHook(() => useLiveStream());
    expect(result.current.connected).toBe(false);
    expect(result.current.matches).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("opens an EventSource with the correct URL", () => {
    renderHook(() => useLiveStream());
    expect(globalThis.EventSource).toHaveBeenCalledWith(
      `${SSE}/matches/live/stream`,
    );
  });

  it("sets connected=true when the connection opens", () => {
    const { result } = renderHook(() => useLiveStream());
    act(() => {
      fakeEs.onopen!(new Event("open"));
    });
    expect(result.current.connected).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("updates matches when a valid message is received", () => {
    const { result } = renderHook(() => useLiveStream());
    const payload = [{ id: 1, name: "PSG vs OM" }];
    act(() => {
      fakeEs.onmessage!(
        new MessageEvent("message", { data: JSON.stringify(payload) }),
      );
    });
    expect(result.current.matches).toEqual(payload);
  });

  it("sets error when the message contains invalid JSON", () => {
    const { result } = renderHook(() => useLiveStream());
    act(() => {
      fakeEs.onmessage!(
        new MessageEvent("message", { data: "not valid json" }),
      );
    });
    expect(result.current.error).toBe("Format de données attendu");
  });

  it("sets connected=false and an error when the connection fails", () => {
    const { result } = renderHook(() => useLiveStream());
    act(() => {
      fakeEs.onopen!(new Event("open"));
    });
    act(() => {
      fakeEs.onerror!(new Event("error"));
    });
    expect(result.current.connected).toBe(false);
    expect(result.current.error).toBe("Connexion au flux en direct perdue");
  });

  it("closes the EventSource on unmount to prevent memory leaks", () => {
    const { unmount } = renderHook(() => useLiveStream());
    unmount();
    expect(fakeEs.close).toHaveBeenCalledOnce();
  });
});
