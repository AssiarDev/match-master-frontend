import type { StandingEntry } from '../types'
import { useFetch } from './useFetch'

export const useStandings = (competitionId?: number | string) => {
  const { data, loading, error } = useFetch<StandingEntry[]>(
    competitionId ? `${import.meta.env.VITE_API_URL}/standings/${competitionId}` : null
  )

  return { standings: data ?? [], loading, error }
}
