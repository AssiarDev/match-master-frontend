import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useDeleteLeagueFavorite } from "./useDeleteLeagueFavorite";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

describe("useDeleteLeagueFavorite", () => {
  it("starts with error=null", () => {
    const { result } = renderHook(() => useDeleteLeagueFavorite());
    expect(result.current.error).toBeNull();
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useDeleteLeagueFavorite());
    let data: unknown;
    await act(async () => {
      data = await result.current.deleteLeagueFavorite(5);
    });
    expect(data).toEqual({ success: true });
    expect(result.current.error).toBeNull();
  });

  it("calls the correct URL with the league id", async () => {
    let calledUrl = "";
    server.use(
      http.delete(
        `${API}/protected/users/favorites-leagues/:leagueId`,
        ({ request }) => {
          calledUrl = request.url;
          return HttpResponse.json({ success: true });
        },
      ),
    );
    const { result } = renderHook(() => useDeleteLeagueFavorite());
    await act(async () => {
      await result.current.deleteLeagueFavorite(99);
    });
    expect(calledUrl).toContain("/favorites-leagues/99");
  });

  it("sets error when the API returns a non-ok response", async () => {
    server.use(
      http.delete(`${API}/protected/users/favorites-leagues/:leagueId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useDeleteLeagueFavorite());
    await act(async () => {
      await result.current.deleteLeagueFavorite(5);
    });
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });
});
