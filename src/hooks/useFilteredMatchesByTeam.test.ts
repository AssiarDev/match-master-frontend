import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw";
import { useFilteredMatchesByTeam } from "./useFilteredMatchesByTeam";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TEAM_ID = 85;

const fixture = (id: number, state_id: number, starting_at_timestamp = id) => ({
  id,
  state_id,
  starting_at: "2020-01-01 20:00:00",
  starting_at_timestamp,
  participants: [{ id: TEAM_ID }],
});

const idsFor = async (filter: "upcoming" | "finished" | "all") => {
  const { result } = renderHook(() =>
    useFilteredMatchesByTeam(8, TEAM_ID, filter),
  );
  await waitFor(() => expect(result.current.length).toBeGreaterThan(0));
  return result.current.map((match) => match.id);
};

beforeEach(() => {
  server.use(
    http.get(`${API}/competitions/8/matches`, () =>
      HttpResponse.json({
        fixtures: [
          fixture(1, 1),
          fixture(2, 2),
          fixture(3, 10),
          fixture(4, 5),
          fixture(5, 12),
          { ...fixture(6, 5), participants: [{ id: 999 }] },
        ],
      }),
    ),
  );
});

describe("useFilteredMatchesByTeam", () => {
  it("puts upcoming, live and postponed matches in the upcoming tab, even with a past date", async () => {
    expect(await idsFor("upcoming")).toEqual([3, 2, 1]);
  });

  it("puts finished and cancelled matches in the finished tab", async () => {
    expect(await idsFor("finished")).toEqual([5, 4]);
  });

  it("keeps every match of the team in one of the two tabs", async () => {
    const all = await idsFor("all");
    expect(all).toEqual([5, 4, 3, 2, 1]);
  });

  it("sorts by timestamp, most recent first", async () => {
    server.use(
      http.get(`${API}/competitions/8/matches`, () =>
        HttpResponse.json({
          fixtures: [
            fixture(1, 5, 100),
            fixture(2, 5, 300),
            fixture(3, 5, 200),
          ],
        }),
      ),
    );

    expect(await idsFor("finished")).toEqual([2, 3, 1]);
  });
});
