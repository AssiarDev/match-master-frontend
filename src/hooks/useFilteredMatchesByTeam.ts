import { useMemo } from 'react'
import type { Match, Stage } from '../types'
import { useFetch } from './useFetch'

type MatchFilter = 'upcoming' | 'finished' | 'all'

export const useFilteredMatchesByTeam = (
  leagueId?: number | string,
  teamId?: number | string,
  filter: MatchFilter = 'all'
) => {
  const { data } = useFetch<Stage | Stage[]>(
    leagueId && teamId
      ? `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
      : null
  )

  return useMemo<Match[]>(() => {
    if (!data) return []
    const stages = Array.isArray(data) ? data : [data]
    const allRounds = stages.flatMap(stage => stage.rounds ?? [])
    const allFixtures = allRounds.flatMap(round => round.fixtures ?? [])
    const filtered = allFixtures.filter(fixture =>
      fixture.participants?.some(p => p.id === Number(teamId))
    )
    const now = new Date()
    return filtered
      .filter(match => {
        const matchDate = new Date(match.starting_at)
        if (filter === 'upcoming') return matchDate > now
        if (filter === 'finished') return matchDate <= now
        return true
      })
      .sort((a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime())
  }, [data, teamId, filter])
}
