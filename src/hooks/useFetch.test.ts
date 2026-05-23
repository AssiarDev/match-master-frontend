import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useFetch } from "./useFetch";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const URL = `${API}/matches`;

describe("useFetch", () => {
  it("does not fetch when url is null", () => {
    const { result } = renderHook(() => useFetch(null));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data on success", async () => {
    const payload = [{ id: 1 }];
    server.use(http.get(URL, () => HttpResponse.json(payload)));

    const { result } = renderHook(() => useFetch<typeof payload>(URL));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  it("sets error on HTTP error response", async () => {
    server.use(http.get(URL, () => HttpResponse.json(null, { status: 500 })));

    const { result } = renderHook(() => useFetch(URL));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
    expect(result.current.data).toBeNull();
  });

  it("re-fetches and updates data on refresh", async () => {
    const first = [{ id: 1 }];
    const second = [{ id: 2 }];

    server.use(http.get(URL, () => HttpResponse.json(first)));
    const { result } = renderHook(() => useFetch<typeof first>(URL));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(first);

    server.use(http.get(URL, () => HttpResponse.json(second)));
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.data).toEqual(second);
  });
});
