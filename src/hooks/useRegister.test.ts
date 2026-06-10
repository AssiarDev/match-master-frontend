import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { createElement, type ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { useRegister } from "./useRegister";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(
    MemoryRouter,
    null,
    createElement(AuthProvider, null, children),
  );

describe("useRegister", () => {
  it("sets error immediately when passwords do not match without calling the API", async () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.register("user", "user@test.com", "abc", "xyz");
    });

    expect(result.current.error).toBe(
      "Les mots de passe ne correspondent pas.",
    );
    expect(result.current.loading).toBe(false);
  });

  it("navigates to /login and clears error on successful registration", async () => {
    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.register("user", "user@test.com", "pass", "pass");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("calls onSuccess callback on successful registration", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.register(
        "user",
        "user@test.com",
        "pass",
        "pass",
        onSuccess,
      );
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("sets error on non-ok API response", async () => {
    server.use(
      http.post(`${API}/register`, () =>
        HttpResponse.json(null, { status: 400 }),
      ),
    );
    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.register("user", "user@test.com", "pass", "pass");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe("");
  });

  it("sets error on network failure", async () => {
    server.use(http.post(`${API}/register`, () => HttpResponse.error()));
    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.register("user", "user@test.com", "pass", "pass");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBe("");
  });
});
