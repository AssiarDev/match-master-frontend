import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const server = setupServer(
  http.get(`${API}/user/profile`, () =>
    HttpResponse.json({ isAuthenticated: true, user: { id: 1, name: "Test" } }),
  ),
  http.post(`${API}/login`, () => HttpResponse.json({}, { status: 200 })),
);
