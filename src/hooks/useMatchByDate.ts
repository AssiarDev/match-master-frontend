import type { MatchesByLeague } from "../types";
import { useFetch } from "./useFetch";

/**
 * Formats a date as YYYY-MM-DD for the API, anchored on Europe/Paris.
 *
 * `toISOString()` must not be used here: it converts to UTC, so any instant
 * between midnight and the UTC offset (00:00–01:59 in Paris summer time)
 * would resolve to the previous calendar day and fetch the wrong matches.
 * The date shown in the UI is already rendered in Europe/Paris, so the
 * request must use the same reference.
 *
 * @param date - Date to format (Date or ISO string)
 * @returns The calendar day in Paris, as YYYY-MM-DD
 */
const formatDate = (date: Date | string): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
};

/**
 * Fetches matches for a given date, grouped by league.
 * The request is skipped if no date is provided.
 *
 * @param selectedDate - Date to fetch matches for (Date, ISO string, or null)
 * @returns `{ matchesByDate, loading, error }`
 */
export const useMatchByDate = (selectedDate?: Date | string | null) => {
  const formattedDate = selectedDate ? formatDate(selectedDate) : null;

  const { data, loading, error } = useFetch<{ data?: MatchesByLeague }>(
    formattedDate
      ? `${import.meta.env.VITE_API_URL}/competitions/matches?date=${formattedDate}`
      : null,
  );

  return { matchesByDate: data?.data ?? {}, loading, error };
};
