import type { StandingEntry } from '../types'
import { useFetch } from './useFetch'

interface TeamDetail {
  id: number
  name: string
  image_path?: string
  short_code?: string
  [key: string]: unknown
}

export const useTeamDetails = (teamId?: number | string, leagueId?: number | string) => {
  const enabled = Boolean(teamId && leagueId)

  const { data: team, loading } = useFetch<TeamDetail>(
    enabled ? `${import.meta.env.VITE_API_URL}/teams/${teamId}` : null
  )

  const { data: standingsData } = useFetch<StandingEntry[]>(
    enabled ? `${import.meta.env.VITE_API_URL}/standings/${leagueId}` : null
  )

  return { team, standings: standingsData ?? [], loading }
}
