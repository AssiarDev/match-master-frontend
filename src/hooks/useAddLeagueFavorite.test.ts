import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useAddLeagueFavorite } from "./useAddLeagueFavorite";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

describe("useAddLeagueFavorite", () => {
  it("starts with error=null", () => {
    const { result } = renderHook(() => useAddLeagueFavorite());
    expect(result.current.error).toBeNull();
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useAddLeagueFavorite());
    let data: unknown;
    await act(async () => {
      data = await result.current.addLeagueFavorite(1, 5);
    });
    expect(data).toEqual({ id: 1, leagueId: 5 });
    expect(result.current.error).toBeNull();
  });

  it("sends userId and leagueId in the request body", async () => {
    let receivedBody: unknown;
    server.use(
      http.post(
        `${API}/protected/users/favorites-leagues`,
        async ({ request }) => {
          receivedBody = await request.json();
          return HttpResponse.json({ id: 1, leagueId: 7 }, { status: 201 });
        },
      ),
    );
    const { result } = renderHook(() => useAddLeagueFavorite());
    await act(async () => {
      await result.current.addLeagueFavorite(2, 7);
    });
    expect(receivedBody).toEqual({ userId: 2, leagueId: 7 });
  });

  it("sets error when the API returns a non-ok response", async () => {
    server.use(
      http.post(`${API}/protected/users/favorites-leagues`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useAddLeagueFavorite());
    await act(async () => {
      await result.current.addLeagueFavorite(1, 5);
    });
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });
});
