import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RegisterModal } from "./RegisterModal";

const renderRegisterModal = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterModal />
      </AuthProvider>
    </MemoryRouter>,
  );

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  {
    username = "TestUser",
    email = "test@example.com",
    password = "Password1!",
    confirmPassword = "Password1!",
    acceptConsent = true,
  }: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptConsent?: boolean;
  } = {},
) => {
  await user.type(screen.getByPlaceholderText("Nom d'utilisateur"), username);
  await user.type(screen.getByPlaceholderText("Email"), email);
  await user.type(screen.getByPlaceholderText("Mot de passe"), password);
  await user.type(
    screen.getByPlaceholderText("Confirmez le mot de passe"),
    confirmPassword,
  );
  if (acceptConsent) {
    await user.click(screen.getByRole("checkbox"));
  }
};

describe("RegisterModal", () => {
  it("renders all form fields", () => {
    renderRegisterModal();
    expect(
      screen.getByPlaceholderText("Nom d'utilisateur"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirmez le mot de passe"),
    ).toBeInTheDocument();
  });

  it("email field requires a valid email format", () => {
    renderRegisterModal();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
  });

  it("submit button is disabled until consent is checked", () => {
    renderRegisterModal();
    expect(screen.getByRole("button", { name: "S'inscrire" })).toBeDisabled();
  });

  it("submit button is enabled after checking consent", async () => {
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("button", { name: "S'inscrire" })).toBeEnabled();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user, { password: "Password1!", confirmPassword: "autre" });
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));

    await waitFor(() =>
      expect(
        screen.getByText("Les mots de passe ne correspondent pas."),
      ).toBeInTheDocument(),
    );
  });

  it("has a link to the login page", () => {
    renderRegisterModal();
    expect(
      screen.getByRole("link", { name: "Connectez-vous ici" }),
    ).toHaveAttribute("href", "/login");
  });
});
