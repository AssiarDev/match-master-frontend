import { useMemo } from 'react'
import type { League } from '../types'
import { useFetch } from './useFetch'

interface RawCompetition {
  name?: string
  id: number
  emblem?: string
}

export const useLeagues = () => {
  const { data, loading } = useFetch<RawCompetition[]>(
    `${import.meta.env.VITE_API_URL}/competitions`
  )

  const leagues = useMemo<League[]>(() => {
    if (!data) return []
    return data
      .filter(league => league.name)
      .map(league => ({
        name: league.name as string,
        code: league.id,
        logo: league.emblem,
      }))
  }, [data])

  return { leagues, loading }
}
