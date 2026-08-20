import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw";
import { useMatchByDate } from "./useMatchByDate";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Registers the endpoint and returns a getter on the `date` query param it received. */
const captureRequestedDate = () => {
  let requestedDate: string | null = null;

  server.use(
    http.get(`${API}/competitions/matches`, ({ request }) => {
      requestedDate = new URL(request.url).searchParams.get("date");
      return HttpResponse.json({ data: {} });
    }),
  );

  return () => requestedDate;
};

describe("useMatchByDate", () => {
  it("requests the calendar day as seen in Paris, not the UTC day", async () => {
    const requestedDate = captureRequestedDate();

    // 00:30 in Paris is still 22:30 the day before in UTC
    renderHook(() => useMatchByDate(new Date("2026-08-16T00:30:00+02:00")));

    await waitFor(() => expect(requestedDate()).toBe("2026-08-16"));
  });

  it("keeps the same day for an instant far from the date boundary", async () => {
    const requestedDate = captureRequestedDate();

    renderHook(() => useMatchByDate(new Date("2026-08-16T15:00:00+02:00")));

    await waitFor(() => expect(requestedDate()).toBe("2026-08-16"));
  });

  it("skips the request when no date is provided", () => {
    const { result } = renderHook(() => useMatchByDate(null));

    expect(result.current.matchesByDate).toEqual({});
    expect(result.current.loading).toBe(false);
  });
});
