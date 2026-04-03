import { useMemo } from 'react'
import type { Match, Stage } from '../types'
import { useFetch } from './useFetch'

export const useResumeMatchs = (competitionId?: number | string) => {
  const { data } = useFetch<Stage | Stage[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
      : null
  )

  return useMemo<Match[]>(() => {
    if (!data) return []
    const stages = Array.isArray(data) ? data : [data]
    const allRounds = stages.flatMap(stage => stage.rounds ?? [])
    const allFixtures = allRounds.flatMap(round => round.fixtures ?? [])
    return allFixtures
      .filter(f => f.state_id === 5)
      .sort((a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime())
      .slice(0, 5)
  }, [data])
}
