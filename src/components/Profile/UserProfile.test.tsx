import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as AuthContext from "@/context/AuthContext";
import * as useLogoutModule from "@/hooks/useLogout";
import * as useDeleteProfileModule from "@/hooks/useDeleteProfile";
import * as useUpdateInfoUserModule from "@/hooks/useUpdateInfoUser";
import { UserProfile } from "./UserProfile";

vi.mock("@/context/AuthContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("@/hooks/useLogout", () => ({ useLogout: vi.fn() }));
vi.mock("@/hooks/useDeleteProfile", () => ({ useDeleteProfile: vi.fn() }));
vi.mock("@/hooks/useUpdateInfoUser", () => ({ useUpdateInfoUser: vi.fn() }));

const mockLogout = vi.fn();
const mockDeleteProfile = vi.fn();
const mockUpdateUser = vi.fn();

beforeEach(() => {
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    user: { id: 1, username: "TestUser", createdAt: "2024-01-01" },
    isAuthenticated: true,
    loading: false,
    setIsAuthenticated: vi.fn(),
    setUser: vi.fn(),
    checkAuth: vi.fn(),
  });
  vi.mocked(useLogoutModule.useLogout).mockReturnValue(mockLogout);
  vi.mocked(useDeleteProfileModule.useDeleteProfile).mockReturnValue(
    mockDeleteProfile,
  );
  vi.mocked(useUpdateInfoUserModule.useUpdateInfoUser).mockReturnValue({
    error: "",
    loading: false,
    updateUser: mockUpdateUser,
  });
});

describe("UserProfile", () => {
  it("displays the authenticated user's username", () => {
    render(<UserProfile />);
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  it("displays the user's registration date", () => {
    render(<UserProfile />);
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });

  it("does not show the username modal by default", () => {
    render(<UserProfile />);
    expect(
      screen.queryByText("Modifier votre nom d'utilisateur"),
    ).not.toBeInTheDocument();
  });

  it("does not show the password modal by default", () => {
    render(<UserProfile />);
    expect(
      screen.queryByText("Modifier votre mot de passe"),
    ).not.toBeInTheDocument();
  });

  it("opens the username modal when clicking Modifier for username", () => {
    render(<UserProfile />);
    const modifierButtons = screen.getAllByRole("button", { name: "Modifier" });
    fireEvent.click(modifierButtons[0]);
    expect(
      screen.getByText("Modifier votre nom d'utilisateur"),
    ).toBeInTheDocument();
  });

  it("opens the password modal when clicking Modifier for password", () => {
    render(<UserProfile />);
    const modifierButtons = screen.getAllByRole("button", { name: "Modifier" });
    fireEvent.click(modifierButtons[1]);
    expect(screen.getByText("Modifier votre mot de passe")).toBeInTheDocument();
  });

  it("calls logout when clicking Déconnexion", () => {
    render(<UserProfile />);
    fireEvent.click(screen.getByRole("button", { name: "Déconnexion" }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("calls deleteProfile with the user id when clicking Supprimer mon compte", () => {
    render(<UserProfile />);
    fireEvent.click(
      screen.getByRole("button", { name: "Supprimer mon compte" }),
    );
    expect(mockDeleteProfile).toHaveBeenCalledWith(1);
  });
});
