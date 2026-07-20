import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as AuthContext from "@/context/AuthContext";
import * as useUpdateInfoUserModule from "@/hooks/useUpdateInfoUser";
import { EditUsernameModal } from "./EditUsernameModal";

vi.mock("@/context/AuthContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("@/hooks/useUpdateInfoUser", () => ({ useUpdateInfoUser: vi.fn() }));

const mockUpdateUser = vi.fn();
const mockOnClose = vi.fn();

beforeEach(() => {
  mockOnClose.mockReset();
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

const renderModal = () => render(<EditUsernameModal onClose={mockOnClose} />);

describe("EditUsernameModal", () => {
  it("renders the username input field", () => {
    renderModal();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
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

  it("calls updateUser with the user id and new username on submit", async () => {
    mockUpdateUser.mockResolvedValue(false);
    const user = userEvent.setup({ delay: null });
    renderModal();
    await user.type(screen.getByPlaceholderText("Username"), "nouveauNom");
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await waitFor(() =>
      expect(mockUpdateUser).toHaveBeenCalledWith(1, "nouveauNom"),
    );
  });

  it("calls onClose after a successful update", async () => {
    mockUpdateUser.mockResolvedValue(true);
    const user = userEvent.setup({ delay: null });
    renderModal();
    await user.type(screen.getByPlaceholderText("Username"), "nouveauNom");
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });
});
