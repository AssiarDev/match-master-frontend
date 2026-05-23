import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { createElement, type ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { useLogin } from "./useLogin";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    MemoryRouter,
    null,
    createElement(AuthProvider, null, children),
  );

describe("useLogin", () => {
  it("navigates to / on successful login and valid session", async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login("user@test.com", "password");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("");
  });

  it("sets error when checkAuth returns false after login", async () => {
    server.use(
      http.get(`${API}/user/profile`, () =>
        HttpResponse.json({ isAuthenticated: false, user: null }),
      ),
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login("user@test.com", "password");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe("");
  });

  it("sets error on non-ok HTTP response", async () => {
    server.use(
      http.post(`${API}/login`, () => HttpResponse.json(null, { status: 401 })),
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login("user@test.com", "wrong");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe("");
  });

  it("calls onSuccess callback on successful login", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.login("user@test.com", "password", onSuccess);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
