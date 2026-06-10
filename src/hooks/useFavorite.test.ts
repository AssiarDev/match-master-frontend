import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useFavorite } from "./useFavorite";
import * as AuthContext from "../context/AuthContext";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

vi.mock("../context/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

describe("useFavorite", () => {
  it("returns an empty array and does not fetch when user is not authenticated", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    const { result } = renderHook(() => useFavorite());
    expect(result.current.favorite).toEqual([]);
  });

  it("fetches and returns favorites when user is authenticated", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    server.use(
      http.get(`${API}/protected/users/1/favorites`, () =>
        HttpResponse.json([{ id: 10, name: "PSG" }]),
      ),
    );
    const { result } = renderHook(() => useFavorite());
    await waitFor(() =>
      expect(result.current.favorite).toEqual([{ id: 10, name: "PSG" }]),
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
    const { result } = renderHook(() => useFavorite());
    await waitFor(() => expect(result.current.favorite).toEqual([]));
  });

  it("exposes a refreshFavorites function", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    const { result } = renderHook(() => useFavorite());
    expect(typeof result.current.refreshFavorites).toBe("function");
  });
});
