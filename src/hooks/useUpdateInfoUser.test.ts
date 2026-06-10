import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import * as AuthContext from "../context/AuthContext";
import { useUpdateInfoUser } from "./useUpdateInfoUser";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

vi.mock("../context/AuthContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../context/AuthContext")>();
  return { ...actual, useAuth: vi.fn() };
});

const mockCheckAuth = vi.fn();

const setupAuth = () =>
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    isAuthenticated: true,
    loading: false,
    user: { id: 1, name: "Test" },
    setIsAuthenticated: vi.fn(),
    setUser: vi.fn(),
    checkAuth: mockCheckAuth,
  });

describe("useUpdateInfoUser", () => {
  it("starts with error='' and loading=false", () => {
    setupAuth();
    const { result } = renderHook(() => useUpdateInfoUser());
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("returns true and calls checkAuth on success", async () => {
    setupAuth();
    const { result } = renderHook(() => useUpdateInfoUser());
    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.updateUser(1, "newUsername");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(returnValue).toBe(true);
    expect(mockCheckAuth).toHaveBeenCalledOnce();
  });

  it("sets error from API message on non-ok response", async () => {
    setupAuth();
    server.use(
      http.put(`${API}/users/:userId`, () =>
        HttpResponse.json({ error: "Mot de passe incorrect" }, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useUpdateInfoUser());
    await act(async () => {
      await result.current.updateUser(1, undefined, "wrong", "new", "new");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Mot de passe incorrect");
  });

  it("sets error on network failure", async () => {
    setupAuth();
    server.use(http.put(`${API}/users/:userId`, () => HttpResponse.error()));
    const { result } = renderHook(() => useUpdateInfoUser());
    await act(async () => {
      await result.current.updateUser(1, "user");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe("");
  });
});
