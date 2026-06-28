import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw";
import { useTeams } from "./useTeams";
import type { Competition } from "@/types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const competitions: Competition[] = [
  { id: 1, name: "Ligue 1" },
  { id: 2, name: "Premier League" },
];

const teamItem = (id: number, name: string) => ({
  team: { id, name, image_path: `/${name}.png`, short_code: name.slice(0, 3) },
});

describe("useTeams", () => {
  it("returns empty teams without fetching when no competitions are provided", () => {
    const { result } = renderHook(() => useTeams([]));
    expect(result.current.teams).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("fetches teams from each competition", async () => {
    server.use(
      http.get(`${API}/competitions/1/teams`, () =>
        HttpResponse.json([teamItem(10, "PSG")]),
      ),
      http.get(`${API}/competitions/2/teams`, () =>
        HttpResponse.json([teamItem(20, "Arsenal")]),
      ),
    );

    const { result } = renderHook(() => useTeams(competitions));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.teams).toHaveLength(2);
    expect(result.current.teams.map((t) => t.name)).toContain("PSG");
    expect(result.current.teams.map((t) => t.name)).toContain("Arsenal");
  });

  it("deduplicates teams that appear in multiple competitions", async () => {
    server.use(
      http.get(`${API}/competitions/1/teams`, () =>
        HttpResponse.json([teamItem(10, "PSG")]),
      ),
      http.get(`${API}/competitions/2/teams`, () =>
        HttpResponse.json([teamItem(10, "PSG")]),
      ),
    );

    const { result } = renderHook(() => useTeams(competitions));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.teams).toHaveLength(1);
  });

  it("retains the leagueId of the first competition the team was found in", async () => {
    server.use(
      http.get(`${API}/competitions/1/teams`, () =>
        HttpResponse.json([teamItem(10, "PSG")]),
      ),
      http.get(`${API}/competitions/2/teams`, () =>
        HttpResponse.json([teamItem(10, "PSG")]),
      ),
    );

    const { result } = renderHook(() => useTeams(competitions));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.teams[0].leagueId).toBe(1);
  });

  it("ignores items with a missing or nameless team", async () => {
    server.use(
      http.get(`${API}/competitions/1/teams`, () =>
        HttpResponse.json([{ team: null }, teamItem(10, "PSG")]),
      ),
      http.get(`${API}/competitions/2/teams`, () => HttpResponse.json([])),
    );

    const { result } = renderHook(() => useTeams(competitions));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.teams).toHaveLength(1);
    expect(result.current.teams[0].name).toBe("PSG");
  });
});
