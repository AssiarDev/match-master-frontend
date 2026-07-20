import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModal } from "./LoginModal";
import { http, HttpResponse, delay } from "msw";
import { server } from "@/test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const renderLoginModal = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginModal />
      </AuthProvider>
    </MemoryRouter>,
  );

describe("LoginModal", () => {
  it("renders email and password fields", () => {
    renderLoginModal();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderLoginModal();
    expect(
      screen.getByRole("button", { name: "Se connecter" }),
    ).toBeInTheDocument();
  });

  it("email field requires a valid email format", () => {
    renderLoginModal();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
  });

  it("password field is required", () => {
    renderLoginModal();
    expect(screen.getByPlaceholderText("Mot de passe")).toHaveAttribute(
      "required",
    );
  });

  it("shows loading state while submitting", async () => {
    server.use(
      http.post(`${API}/login`, async () => {
        await delay(300);
        return HttpResponse.json({});
      }),
    );

    const user = userEvent.setup({ delay: null });
    renderLoginModal();
    await user.type(screen.getByPlaceholderText("Email"), "user@test.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "password");

    const clickPromise = user.click(
      screen.getByRole("button", { name: "Se connecter" }),
    );
    await waitFor(() =>
      expect(screen.getByText("Connexion...")).toBeInTheDocument(),
    );
    await clickPromise;
  });

  it("shows error message on failed login", async () => {
    server.use(
      http.post(`${API}/login`, () => HttpResponse.json(null, { status: 401 })),
    );

    const user = userEvent.setup({ delay: null });
    renderLoginModal();

    await user.type(screen.getByPlaceholderText("Email"), "user@test.com");
    await user.type(screen.getByPlaceholderText("Mot de passe"), "mauvais-mdp");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() =>
      expect(
        screen.getByText("Erreur de connexion au serveur"),
      ).toBeInTheDocument(),
    );
  });

  it("has a link to the register page", () => {
    renderLoginModal();
    expect(
      screen.getByRole("link", { name: "Créez un compte ici" }),
    ).toHaveAttribute("href", "/register");
  });
});
