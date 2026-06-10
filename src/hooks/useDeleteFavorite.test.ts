import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useDeleteFavorite } from "./useDeleteFavorite";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

describe("useDeleteFavorite", () => {
  it("starts with error=null", () => {
    const { result } = renderHook(() => useDeleteFavorite());
    expect(result.current.error).toBeNull();
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useDeleteFavorite());
    let data: unknown;
    await act(async () => {
      data = await result.current.deleteFavorite(10);
    });
    expect(data).toEqual({ success: true });
    expect(result.current.error).toBeNull();
  });

  it("calls the correct URL with the club id", async () => {
    let calledUrl = "";
    server.use(
      http.delete(`${API}/protected/users/favorites/:clubId`, ({ request }) => {
        calledUrl = request.url;
        return HttpResponse.json({ success: true });
      }),
    );
    const { result } = renderHook(() => useDeleteFavorite());
    await act(async () => {
      await result.current.deleteFavorite(99);
    });
    expect(calledUrl).toContain("/favorites/99");
  });

  it("sets error when the API returns a non-ok response", async () => {
    server.use(
      http.delete(`${API}/protected/users/favorites/:clubId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useDeleteFavorite());
    await act(async () => {
      await result.current.deleteFavorite(10);
    });
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });
});
