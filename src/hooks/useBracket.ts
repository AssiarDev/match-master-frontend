import { useMemo } from "react";
import type { Stage } from "../types";
import type { StageGroup } from "../utils/groupMatchesByStage";
import { useFetch } from "./useFetch";
import { groupMatchesByStage } from "@/utils/groupMatchesByStage";

/**
 * Fetches cup fixtures and groups them by stage for bracket display.
 * The request is skipped if no competitionId is provided.
 *
 * @param competitionId - ID of the competition
 * @returns `{ stages, loading, error }`
 */
export const useBracket = (competitionId?: number | string) => {
  const { data, loading, error } = useFetch<Stage | Stage[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
      : null,
  );

  const stages: StageGroup[] = useMemo(
    () => (data ? groupMatchesByStage(data) : []),
    [data],
  );

  return { stages, loading, error };
};
