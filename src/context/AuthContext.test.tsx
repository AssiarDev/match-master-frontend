import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { AuthProvider, useAuth } from "./AuthContext";
import { server } from "../test/msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(AuthProvider, null, children);

describe("AuthProvider", () => {
  it("starts with loading=true and isAuthenticated=false before the fetch resolves", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("sets isAuthenticated and user after a successful profile fetch", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: "Test" });
  });

  it("sets isAuthenticated=false and user=null when API returns a non-ok response", async () => {
    server.use(
      http.get(`${API}/user/profile`, () =>
        HttpResponse.json(null, { status: 401 }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("sets isAuthenticated=false and user=null on network error", async () => {
    server.use(http.get(`${API}/user/profile`, () => HttpResponse.error()));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("checkAuth returns true when the session is valid", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.checkAuth();
    });
    expect(returnValue).toBe(true);
  });

  it("checkAuth returns false when the session is invalid", async () => {
    server.use(
      http.get(`${API}/user/profile`, () =>
        HttpResponse.json({ isAuthenticated: false, user: null }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.checkAuth();
    });
    expect(returnValue).toBe(false);
  });

  it("setIsAuthenticated and setUser update the context state", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setIsAuthenticated(false);
      result.current.setUser(null);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

describe("useAuth", () => {
  it("throws when used outside of AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
