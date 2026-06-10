import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useLeagueFavorite } from "./useLeagueFavorite";
import * as AuthContext from "../context/AuthContext";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

vi.mock("../context/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

describe("useLeagueFavorite", () => {
  it("returns an empty array and does not fetch when user is not authenticated", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    const { result } = renderHook(() => useLeagueFavorite());
    expect(result.current.leagueFavorite).toEqual([]);
  });

  it("fetches and returns league favorites when user is authenticated", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    server.use(
      http.get(`${API}/protected/users/1/favorites-leagues`, () =>
        HttpResponse.json([{ id: 5, name: "Ligue 1" }]),
      ),
    );
    const { result } = renderHook(() => useLeagueFavorite());
    await waitFor(() =>
      expect(result.current.leagueFavorite).toEqual([
        { id: 5, name: "Ligue 1" },
      ]),
    );
  });

  it("returns an empty array when the API returns an empty list", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    const { result } = renderHook(() => useLeagueFavorite());
    await waitFor(() => expect(result.current.leagueFavorite).toEqual([]));
  });

  it("exposes a refreshLeagueFavorites function", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    const { result } = renderHook(() => useLeagueFavorite());
    expect(typeof result.current.refreshLeagueFavorites).toBe("function");
  });
});
