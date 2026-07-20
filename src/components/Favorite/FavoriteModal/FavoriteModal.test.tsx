import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FavoriteModal } from "./FavoriteModal";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRefreshFavorites = vi.fn();
const mockDeleteFavorite = vi.fn();
const mockRefreshLeagueFavorites = vi.fn();
const mockDeleteLeagueFavorite = vi.fn();

vi.mock("../../../hooks/useFavorite", () => ({
  useFavorite: vi.fn(),
}));
vi.mock("../../../hooks/useDeleteFavorite", () => ({
  useDeleteFavorite: vi.fn(),
}));
vi.mock("../../../hooks/useLeagueFavorite", () => ({
  useLeagueFavorite: vi.fn(),
}));
vi.mock("../../../hooks/useDeleteLeagueFavorite", () => ({
  useDeleteLeagueFavorite: vi.fn(),
}));

import * as useFavoriteModule from "../../../hooks/useFavorite";
import * as useDeleteFavoriteModule from "../../../hooks/useDeleteFavorite";
import * as useLeagueFavoriteModule from "../../../hooks/useLeagueFavorite";
import * as useDeleteLeagueFavoriteModule from "../../../hooks/useDeleteLeagueFavorite";

const setup = ({
  clubs = [{ id: 1, name: "PSG", emblem: "", leagueId: 5 }],
  leagues = [{ id: 5, name: "Ligue 1", emblem: "" }],
  clubError = null as string | null,
} = {}) => {
  vi.mocked(useFavoriteModule.useFavorite).mockReturnValue({
    favorite: clubs,
    error: clubError,
    refreshFavorites: mockRefreshFavorites,
  });
  vi.mocked(useDeleteFavoriteModule.useDeleteFavorite).mockReturnValue({
    deleteFavorite: mockDeleteFavorite,
    error: null,
  });
  vi.mocked(useLeagueFavoriteModule.useLeagueFavorite).mockReturnValue({
    leagueFavorite: leagues,
    error: null,
    refreshLeagueFavorites: mockRefreshLeagueFavorites,
  });
  vi.mocked(
    useDeleteLeagueFavoriteModule.useDeleteLeagueFavorite,
  ).mockReturnValue({
    deleteLeagueFavorite: mockDeleteLeagueFavorite,
    error: null,
  });

  return render(
    <MemoryRouter>
      <FavoriteModal />
    </MemoryRouter>,
  );
};

describe("FavoriteModal", () => {
  it("renders club favorites", () => {
    setup();
    expect(screen.getByText("PSG")).toBeInTheDocument();
  });

  it("renders league favorites", () => {
    setup();
    expect(screen.getByText("Ligue 1")).toBeInTheDocument();
  });

  it("calls deleteFavorite with the club id when clicking its delete button", async () => {
    mockDeleteFavorite.mockResolvedValue({ message: "Supprimé" });
    setup();
    const deleteButtons = screen.getAllByText("x");
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => expect(mockDeleteFavorite).toHaveBeenCalledWith(1));
  });

  it("calls refreshFavorites after a successful club deletion", async () => {
    mockDeleteFavorite.mockResolvedValue({ message: "Supprimé" });
    setup();
    fireEvent.click(screen.getAllByText("x")[0]);
    await waitFor(() => expect(mockRefreshFavorites).toHaveBeenCalledOnce());
  });

  it("calls deleteLeagueFavorite with the league id when clicking its delete button", async () => {
    mockDeleteLeagueFavorite.mockResolvedValue({ message: "Supprimé" });
    setup();
    const deleteButtons = screen.getAllByText("x");
    fireEvent.click(deleteButtons[1]);
    await waitFor(() =>
      expect(mockDeleteLeagueFavorite).toHaveBeenCalledWith(5),
    );
  });

  it("shows error message when club favorites cannot be loaded", () => {
    setup({ clubs: [], clubError: "Erreur de chargement" });
    expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
  });

  it("calls navigate(-1) when clicking the close button", () => {
    setup();
    fireEvent.click(screen.getByLabelText("Fermer le modal"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
