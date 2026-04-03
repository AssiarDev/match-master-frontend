import { useMemo } from 'react'
import type { Team } from '../types'
import { useFetch } from './useFetch'

interface RawTeamItem {
  team?: {
    id: number
    name?: string
    image_path?: string
    short_code?: string
  }
}

export const useTeamsByLeague = (leagueId?: number | string) => {
  const { data, loading } = useFetch<RawTeamItem[]>(
    leagueId ? `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/teams` : null
  )

  const teams = useMemo<Team[]>(() => {
    if (!Array.isArray(data)) return []
    return data
      .filter(item => item.team?.name)
      .map(item => ({
        id: item.team!.id,
        name: item.team!.name as string,
        image: item.team!.image_path ?? '',
        shortName: item.team!.short_code,
      }))
  }, [data])

  return { teams, loading }
}
