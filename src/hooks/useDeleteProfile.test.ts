import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import * as AuthContext from "../context/AuthContext";
import { useDeleteProfile } from "./useDeleteProfile";
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

describe("useDeleteProfile", () => {
  it("returns a deleteProfile function", () => {
    setupAuth();
    const { result } = renderHook(() => useDeleteProfile());
    expect(typeof result.current).toBe("function");
  });

  it("clears auth state on successful deletion", async () => {
    setupAuth();
    const { result } = renderHook(() => useDeleteProfile());
    await act(async () => {
      await result.current(1);
    });
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it("navigates to / on successful deletion", async () => {
    setupAuth();
    const { result } = renderHook(() => useDeleteProfile());
    await act(async () => {
      await result.current(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/", expect.anything());
  });

  it("does not throw when the API returns an error", async () => {
    setupAuth();
    server.use(
      http.delete(`${API}/users/:userId`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useDeleteProfile());
    await expect(
      act(async () => {
        await result.current(1);
      }),
    ).resolves.not.toThrow();
  });
});
