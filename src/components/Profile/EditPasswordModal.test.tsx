import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as AuthContext from "@/context/AuthContext";
import * as useUpdateInfoUserModule from "@/hooks/useUpdateInfoUser";
import { EditPasswordModal } from "./EditPasswordModal";

vi.mock("@/context/AuthContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("@/hooks/useUpdateInfoUser", () => ({ useUpdateInfoUser: vi.fn() }));

const mockUpdateUser = vi.fn();
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

beforeEach(() => {
  mockOnClose.mockReset();
  mockOnSuccess.mockReset();
  mockUpdateUser.mockReset();
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    user: { id: 1, username: "testuser" },
    isAuthenticated: true,
    loading: false,
    setIsAuthenticated: vi.fn(),
    setUser: vi.fn(),
    checkAuth: vi.fn(),
  });
  vi.mocked(useUpdateInfoUserModule.useUpdateInfoUser).mockReturnValue({
    error: "",
    loading: false,
    updateUser: mockUpdateUser,
  });
});

const renderModal = () =>
  render(<EditPasswordModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

describe("EditPasswordModal", () => {
  it("renders the three password fields", () => {
    renderModal();
    expect(
      screen.getByPlaceholderText("Mot de passe actuel"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nouveau mot de passe"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirmer votre mot de passe"),
    ).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderModal();
    expect(
      screen.getByRole("button", { name: "Modifier" }),
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    renderModal();
    await user.click(screen.getByRole("button", { name: "Fermer le modal" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables the submit button while loading", () => {
    vi.mocked(useUpdateInfoUserModule.useUpdateInfoUser).mockReturnValue({
      error: "",
      loading: true,
      updateUser: mockUpdateUser,
    });
    renderModal();
    expect(screen.getByRole("button", { name: "Modifier" })).toBeDisabled();
  });

  it("displays the error message when there is an error", () => {
    vi.mocked(useUpdateInfoUserModule.useUpdateInfoUser).mockReturnValue({
      error: "Mot de passe actuel incorrect",
      loading: false,
      updateUser: mockUpdateUser,
    });
    renderModal();
    expect(
      screen.getByText("Mot de passe actuel incorrect"),
    ).toBeInTheDocument();
  });

  it("calls onSuccess with a confirmation message after a successful update", async () => {
    mockUpdateUser.mockResolvedValue(true);
    const user = userEvent.setup({ delay: null });
    renderModal();
    await user.type(
      screen.getByPlaceholderText("Mot de passe actuel"),
      "OldPass1!",
    );
    await user.type(
      screen.getByPlaceholderText("Nouveau mot de passe"),
      "NewPass1!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirmer votre mot de passe"),
      "NewPass1!",
    );
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await waitFor(() =>
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Mot de passe mis à jour avec succès",
      ),
    );
  });

  it("does not call onSuccess when the update fails", async () => {
    mockUpdateUser.mockResolvedValue(false);
    const user = userEvent.setup({ delay: null });
    renderModal();
    await user.type(
      screen.getByPlaceholderText("Mot de passe actuel"),
      "OldPass1!",
    );
    await user.type(
      screen.getByPlaceholderText("Nouveau mot de passe"),
      "WrongPass1!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirmer votre mot de passe"),
      "WrongPass1!",
    );
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await waitFor(() => expect(mockUpdateUser).toHaveBeenCalled());
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
