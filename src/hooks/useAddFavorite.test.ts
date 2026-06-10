import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useAddFavorite } from "./useAddFavorite";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

describe("useAddFavorite", () => {
  it("starts with error=null", () => {
    const { result } = renderHook(() => useAddFavorite());
    expect(result.current.error).toBeNull();
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useAddFavorite());
    let data: unknown;
    await act(async () => {
      data = await result.current.addFavorite(1, 10, 3);
    });
    expect(data).toEqual({ id: 1, clubId: 10 });
    expect(result.current.error).toBeNull();
  });

  it("converts a string id to an integer before sending", async () => {
    let receivedBody: unknown;
    server.use(
      http.post(`${API}/protected/users/favorites`, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ id: 1, clubId: 42 }, { status: 201 });
      }),
    );
    const { result } = renderHook(() => useAddFavorite());
    await act(async () => {
      await result.current.addFavorite(1, "42", 3);
    });
    expect((receivedBody as { clubId: number }).clubId).toBe(42);
  });

  it("sets error when the API returns a non-ok response", async () => {
    server.use(
      http.post(`${API}/protected/users/favorites`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useAddFavorite());
    await act(async () => {
      await result.current.addFavorite(1, 10, 3);
    });
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });
});
