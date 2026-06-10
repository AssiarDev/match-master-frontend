import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import * as AuthContext from "../context/AuthContext";

vi.mock("../context/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

type AuthOverrides = Partial<ReturnType<typeof AuthContext.useAuth>>;

const mockAuth = (overrides: AuthOverrides) =>
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    isAuthenticated: false,
    loading: false,
    user: null,
    setIsAuthenticated: vi.fn(),
    setUser: vi.fn(),
    checkAuth: vi.fn(),
    ...overrides,
  });

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("PrivateRoute", () => {
  it("renders nothing while the auth check is in progress", () => {
    mockAuth({ loading: true });
    const { container } = renderRoute();
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders the child route when the user is authenticated", () => {
    mockAuth({ isAuthenticated: true, user: { id: 1, name: "Test" } });
    renderRoute();
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects to /login when the user is not authenticated", () => {
    mockAuth({ isAuthenticated: false });
    renderRoute();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
});
