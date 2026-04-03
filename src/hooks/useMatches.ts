import { useMemo } from 'react'
import type { Match, Stage } from '../types'
import { useFetch } from './useFetch'

const extractFixtures = (data: Stage | Stage[]): Match[] => {
  const stages = Array.isArray(data) ? data : [data]
  const allRounds = stages.flatMap(stage => stage.rounds ?? [])
  return allRounds.flatMap(round => round.fixtures ?? [])
}

export const useMatches = (competitionId?: number | string) => {
  const { data, loading, error } = useFetch<Stage | Stage[]>(
    competitionId
      ? `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
      : null
  )

  const matches = useMemo(() => (data ? extractFixtures(data) : []), [data])

  return { matches, loading, error }
}
