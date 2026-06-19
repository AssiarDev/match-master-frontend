import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { server } from "@/test/msw";
import { RegisterModal } from "./RegisterModal";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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

  it("submit button is enabled after filling all fields and checking consent", async () => {
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user);
    expect(screen.getByRole("button", { name: "S'inscrire" })).toBeEnabled();
  });

  it("consent checkbox is disabled until all fields are filled", async () => {
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    expect(screen.getByRole("checkbox")).toBeDisabled();
    await fillForm(user, { acceptConsent: false });
    expect(screen.getByRole("checkbox")).toBeEnabled();
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

  it("shows error when password is too short", async () => {
    server.use(
      http.post(`${API}/register`, () =>
        HttpResponse.json({ error: "Minimum 8 caractères" }, { status: 400 }),
      ),
    );
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user, { password: "short", confirmPassword: "short" });
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));
    await waitFor(() =>
      expect(screen.getByText("Minimum 8 caractères")).toBeInTheDocument(),
    );
  });

  it("shows error when password has no uppercase", async () => {
    server.use(
      http.post(`${API}/register`, () =>
        HttpResponse.json(
          { error: "Minimum une majuscule requise" },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user, {
      password: "password1!",
      confirmPassword: "password1!",
    });
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));
    await waitFor(() =>
      expect(
        screen.getByText("Minimum une majuscule requise"),
      ).toBeInTheDocument(),
    );
  });

  it("shows error when password has no digit", async () => {
    server.use(
      http.post(`${API}/register`, () =>
        HttpResponse.json(
          { error: "Minimum un chiffre requis" },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user, {
      password: "Password!",
      confirmPassword: "Password!",
    });
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));
    await waitFor(() =>
      expect(screen.getByText("Minimum un chiffre requis")).toBeInTheDocument(),
    );
  });

  it("shows error when password has no special character", async () => {
    server.use(
      http.post(`${API}/register`, () =>
        HttpResponse.json(
          { error: "Minimum un caractère spéciale requis" },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup({ delay: null });
    renderRegisterModal();
    await fillForm(user, {
      password: "Password1",
      confirmPassword: "Password1",
    });
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));
    await waitFor(() =>
      expect(
        screen.getByText("Minimum un caractère spéciale requis"),
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
