import { useEffect, useState, useMemo } from 'react'
import type { Match, Stage } from '../types'

type MatchFilter = 'upcoming' | 'finished' | 'all'

export const useFilteredMatchesByTeam = (
  leagueId?: number | string,
  teamId?: number | string,
  filter: MatchFilter = 'all'
) => {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    if (!leagueId || !teamId) return

    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
        )
        if (!response.ok) throw new Error('Erreur API')

        const data: Stage | Stage[] = await response.json()
        const stages = Array.isArray(data) ? data : [data]
        const allRounds = stages.flatMap(stage => stage.rounds ?? [])
        const allFixtures = allRounds.flatMap(round => round.fixtures ?? [])
        const filtered = allFixtures.filter(fixture =>
          fixture.participants?.some(p => p.id === Number(teamId))
        )
        setMatches(filtered)
      } catch (e) {
        console.error('Une erreur est survenue :', (e as Error).message)
      }
    }
    fetchMatches()
  }, [leagueId, teamId])

  const filteredMatches = useMemo(() => {
    const now = new Date()
    return matches
      .filter(match => {
        const matchDate = new Date(match.starting_at)
        if (filter === 'upcoming') return matchDate > now
        if (filter === 'finished') return matchDate <= now
        return true
      })
      .sort(
        (a, b) =>
          new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
      )
  }, [matches, filter])

  return filteredMatches
}
