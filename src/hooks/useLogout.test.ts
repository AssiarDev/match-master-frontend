import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import * as AuthContext from "../context/AuthContext";
import { useLogout } from "./useLogout";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../context/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

const mockSetIsAuthenticated = vi.fn();
const mockSetUser = vi.fn();

const setupAuth = () =>
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    isAuthenticated: true,
    loading: false,
    user: { id: 1, name: "Test" },
    setIsAuthenticated: mockSetIsAuthenticated,
    setUser: mockSetUser,
    checkAuth: vi.fn(),
  });

describe("useLogout", () => {
  it("returns a logout function", () => {
    setupAuth();
    const { result } = renderHook(() => useLogout());
    expect(typeof result.current).toBe("function");
  });

  it("clears auth state on successful logout", async () => {
    setupAuth();
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    await waitFor(() => {
      expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  it("navigates to /login on successful logout", async () => {
    setupAuth();
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("does not throw when the API returns an error", async () => {
    setupAuth();
    server.use(
      http.post(`${API}/logout`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useLogout());

    await expect(
      act(async () => {
        await result.current();
      }),
    ).resolves.not.toThrow();
  });
});
