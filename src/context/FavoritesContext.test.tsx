import { describe, it, expect, vi } from "vitest";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { FavoritesProvider, useFavoritesContext } from "./FavoritesContext";
import * as AuthContext from "./AuthContext";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

vi.mock("./AuthContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

/** Stubs the auth context with the given user, or a logged-out state when null. */
const mockUser = (user: { id: number } | null) =>
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    user,
    isAuthenticated: user !== null,
    loading: false,
    setIsAuthenticated: vi.fn(),
    setUser: vi.fn(),
    checkAuth: vi.fn(),
  });

/** Serves one club and one league favorite for user 1, counting the requests received. */
const serveFavorites = () => {
  const calls = { clubs: 0, leagues: 0 };
  server.use(
    http.get(`${API}/protected/users/1/favorites`, () => {
      calls.clubs++;
      return HttpResponse.json([{ id: 10, name: "PSG" }]);
    }),
    http.get(`${API}/protected/users/1/favorites-leagues`, () => {
      calls.leagues++;
      return HttpResponse.json([{ id: 5, name: "Ligue 1" }]);
    }),
  );
  return calls;
};

/** Reads the shared lists the way a FavoriteButton does. */
const FavoritesCount = () => {
  const { favorite, leagueFavorite } = useFavoritesContext();
  return (
    <p>
      {favorite.length} club · {leagueFavorite.length} ligue
    </p>
  );
};

describe("FavoritesContext", () => {
  it("throws when used outside FavoritesProvider", () => {
    expect(() => renderHook(() => useFavoritesContext())).toThrow(
      "useFavoritesContext must be used inside FavoritesProvider",
    );
  });

  it("fetches each favorites list once, however many components read it", async () => {
    mockUser({ id: 1 });
    const calls = serveFavorites();
    render(
      <FavoritesProvider>
        <FavoritesCount />
        <FavoritesCount />
        <FavoritesCount />
      </FavoritesProvider>,
    );
    await waitFor(() =>
      expect(screen.getAllByText("1 club · 1 ligue")).toHaveLength(3),
    );
    expect(calls).toEqual({ clubs: 1, leagues: 1 });
  });

  it("exposes empty lists once the user logs out", async () => {
    mockUser({ id: 1 });
    serveFavorites();
    const { result, rerender } = renderHook(() => useFavoritesContext(), {
      wrapper: FavoritesProvider,
    });
    await waitFor(() => {
      expect(result.current.favorite).toHaveLength(1);
      expect(result.current.leagueFavorite).toHaveLength(1);
    });

    mockUser(null);
    rerender();

    expect(result.current.favorite).toEqual([]);
    expect(result.current.leagueFavorite).toEqual([]);
  });
});
