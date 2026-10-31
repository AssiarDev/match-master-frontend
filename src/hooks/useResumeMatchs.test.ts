import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw";
import { useResumeMatchs } from "./useResumeMatchs";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const mockFixtures = (fixtures: object[]) => {
  server.use(
    http.get(`${API}/competitions/5/matches`, () =>
      HttpResponse.json({ fixtures }),
    ),
  );
};

const finishedMatch = (id: number, starting_at_timestamp: number) => ({
  id,
  state_id: 5,
  starting_at: "2026-01-01 20:00:00",
  starting_at_timestamp,
});

describe("useResumeMatchs", () => {
  it("keeps matches decided on penalties and leaves out live and cancelled ones", async () => {
    mockFixtures([
      { ...finishedMatch(1, 100), state_id: 8 },
      { ...finishedMatch(2, 200), state_id: 6 },
      { ...finishedMatch(3, 300), state_id: 12 },
    ]);

    const { result } = renderHook(() => useResumeMatchs(5));

    await waitFor(() =>
      expect(result.current.map((match) => match.id)).toEqual([1]),
    );
  });

  it("sorts by timestamp, most recent first, and keeps 5 matches", async () => {
    mockFixtures([1, 2, 3, 4, 5, 6].map((id) => finishedMatch(id, id * 100)));

    const { result } = renderHook(() => useResumeMatchs(5));

    await waitFor(() =>
      expect(result.current.map((match) => match.id)).toEqual([6, 5, 4, 3, 2]),
    );
  });
});
