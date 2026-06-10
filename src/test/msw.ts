import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const server = setupServer(
  http.get(`${API}/user/profile`, () =>
    HttpResponse.json({ isAuthenticated: true, user: { id: 1, name: "Test" } }),
  ),
  http.post(`${API}/login`, () => HttpResponse.json({}, { status: 200 })),
  http.get(`${API}/protected/users/:userId/favorites`, () =>
    HttpResponse.json([]),
  ),
  http.get(`${API}/protected/users/:userId/favorites-leagues`, () =>
    HttpResponse.json([]),
  ),
  http.post(`${API}/register`, () => HttpResponse.json({}, { status: 201 })),
  http.post(`${API}/logout`, () => HttpResponse.json({}, { status: 200 })),
  http.post(`${API}/protected/users/favorites`, () =>
    HttpResponse.json({ id: 1, clubId: 10 }, { status: 201 }),
  ),
  http.delete(`${API}/protected/users/favorites/:clubId`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.post(`${API}/protected/users/favorites-leagues`, () =>
    HttpResponse.json({ id: 1, leagueId: 5 }, { status: 201 }),
  ),
  http.delete(`${API}/protected/users/favorites-leagues/:leagueId`, () =>
    HttpResponse.json({ success: true }),
  ),
  http.delete(`${API}/users/:userId`, () =>
    HttpResponse.json({ message: "Compte supprimé" }),
  ),
  http.put(`${API}/users/:userId`, () =>
    HttpResponse.json({ message: "Profil mis à jour" }),
  ),
);
