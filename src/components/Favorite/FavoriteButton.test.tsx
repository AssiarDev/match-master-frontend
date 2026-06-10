import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton";
import * as AuthContext from "@/context/AuthContext";
import * as useFavoriteModule from "@/hooks/useFavorite";
import * as useAddFavoriteModule from "@/hooks/useAddFavorite";
import * as useDeleteFavoriteModule from "@/hooks/useDeleteFavorite";
import * as useAddLeagueFavoriteModule from "@/hooks/useAddLeagueFavorite";
import * as useLeagueFavoriteModule from "@/hooks/useLeagueFavorite";
import * as useDeleteLeagueFavoriteModule from "@/hooks/useDeleteLeagueFavorite";

vi.mock("@/context/AuthContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("@/hooks/useFavorite", () => ({ useFavorite: vi.fn() }));
vi.mock("@/hooks/useAddFavorite", () => ({ useAddFavorite: vi.fn() }));
vi.mock("@/hooks/useDeleteFavorite", () => ({ useDeleteFavorite: vi.fn() }));
vi.mock("@/hooks/useAddLeagueFavorite", () => ({
  useAddLeagueFavorite: vi.fn(),
}));
vi.mock("@/hooks/useLeagueFavorite", () => ({ useLeagueFavorite: vi.fn() }));
vi.mock("@/hooks/useDeleteLeagueFavorite", () => ({
  useDeleteLeagueFavorite: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockAddFavorite = vi.fn().mockResolvedValue({});
const mockDeleteFavorite = vi.fn().mockResolvedValue({});
const mockAddLeagueFavorite = vi.fn().mockResolvedValue({});
const mockDeleteLeagueFavorite = vi.fn().mockResolvedValue({});
const mockRefreshFavorites = vi.fn();
const mockRefreshLeagueFavorites = vi.fn();

beforeEach(() => {
  vi.mocked(useAddFavoriteModule.useAddFavorite).mockReturnValue({
    addFavorite: mockAddFavorite,
    error: null,
  });
  vi.mocked(useDeleteFavoriteModule.useDeleteFavorite).mockReturnValue({
    deleteFavorite: mockDeleteFavorite,
    error: null,
  });
  vi.mocked(useAddLeagueFavoriteModule.useAddLeagueFavorite).mockReturnValue({
    addLeagueFavorite: mockAddLeagueFavorite,
    error: null,
  });
  vi.mocked(
    useDeleteLeagueFavoriteModule.useDeleteLeagueFavorite,
  ).mockReturnValue({
    deleteLeagueFavorite: mockDeleteLeagueFavorite,
    error: null,
  });
  vi.mocked(useFavoriteModule.useFavorite).mockReturnValue({
    favorite: [],
    error: null,
    refreshFavorites: mockRefreshFavorites,
  });
  vi.mocked(useLeagueFavoriteModule.useLeagueFavorite).mockReturnValue({
    leagueFavorite: [],
    error: null,
    refreshLeagueFavorites: mockRefreshLeagueFavorites,
  });
});

const renderButton = (props = {}) =>
  render(
    <MemoryRouter>
      <FavoriteButton teamId={10} teamName="PSG" {...props} />
    </MemoryRouter>,
  );

describe("FavoriteButton — club", () => {
  it("shows an empty star when the club is not a favorite", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton();
    expect(screen.getByRole("button", { name: /PSG/i })).toBeInTheDocument();
    expect(screen.getByRole("button").className).toContain("text-gray-400");
  });

  it("shows a filled star when the club is already a favorite", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    vi.mocked(useFavoriteModule.useFavorite).mockReturnValue({
      favorite: [{ id: 10, name: "PSG" }],
      error: null,
      refreshFavorites: mockRefreshFavorites,
    });
    renderButton();
    expect(screen.getByRole("button").className).toContain("text-orange-400");
  });

  it("redirects to /login when the user is not authenticated", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("calls addFavorite when the club is not a favorite", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mockAddFavorite).toHaveBeenCalledWith(1, 10, 0));
  });

  it("calls deleteFavorite when the club is already a favorite", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    vi.mocked(useFavoriteModule.useFavorite).mockReturnValue({
      favorite: [{ id: 10, name: "PSG" }],
      error: null,
      refreshFavorites: mockRefreshFavorites,
    });
    renderButton();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mockDeleteFavorite).toHaveBeenCalledWith(10));
  });

  it("calls refreshFavorites and refreshLeagueFavorites after any action", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton();
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockRefreshFavorites).toHaveBeenCalled();
      expect(mockRefreshLeagueFavorites).toHaveBeenCalled();
    });
  });
});

describe("FavoriteButton — league", () => {
  it("shows an empty star when the league is not a favorite", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton({ competitionId: 5, teamId: undefined });
    expect(screen.getByRole("button").className).toContain("text-gray-400");
  });

  it("shows a filled star when the league is already a favorite", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    vi.mocked(useLeagueFavoriteModule.useLeagueFavorite).mockReturnValue({
      leagueFavorite: [{ id: 5, name: "Ligue 1" }],
      error: null,
      refreshLeagueFavorites: mockRefreshLeagueFavorites,
    });
    renderButton({ competitionId: 5, teamId: undefined });
    expect(screen.getByRole("button").className).toContain("text-orange-400");
  });

  it("calls addLeagueFavorite when the league is not a favorite", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    renderButton({ competitionId: 5, teamId: undefined });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(mockAddLeagueFavorite).toHaveBeenCalledWith(1, 5),
    );
  });

  it("calls deleteLeagueFavorite when the league is already a favorite", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1 },
      loading: false,
      setIsAuthenticated: vi.fn(),
      setUser: vi.fn(),
      checkAuth: vi.fn(),
    });
    vi.mocked(useLeagueFavoriteModule.useLeagueFavorite).mockReturnValue({
      leagueFavorite: [{ id: 5, name: "Ligue 1" }],
      error: null,
      refreshLeagueFavorites: mockRefreshLeagueFavorites,
    });
    renderButton({ competitionId: 5, teamId: undefined });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(mockDeleteLeagueFavorite).toHaveBeenCalledWith(5),
    );
  });
});
