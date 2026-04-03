import { useState, useEffect } from 'react'
import type { Match } from '../types'

interface RawMatchData {
  matches: Array<{
    id: number
    homeTeam: { id: number }
    awayTeam: { id: number }
    starting_at: string
    state_id: number
  }>
}

export const useMatchesByTeam = (leagueId?: number | string, teamId?: number | string) => {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    if (!leagueId || !teamId) return

    const fetchMatches = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
        )
        if (!res.ok) throw new Error('Erreur API')

        const data: RawMatchData = await res.json()
        const teamMatches = data.matches.filter(
          match =>
            match.homeTeam.id === Number(teamId) ||
            match.awayTeam.id === Number(teamId)
        )
        setMatches(teamMatches as unknown as Match[])
      } catch (err) {
        console.error('useMatchesByTeam :', (err as Error).message)
      }
    }

    fetchMatches()
  }, [leagueId, teamId])

  return matches
}
