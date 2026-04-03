import { useState, useEffect } from 'react'
import type { Match, Stage } from '../types'

export const useMatches = (competitionId?: number | string) => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
        )
        if (!response.ok) throw new Error('Impossible de récupérer les matchs')

        const data: Stage | Stage[] = await response.json()
        const stages = Array.isArray(data) ? data : [data]
        const allRounds = stages.flatMap(stage => stage.rounds ?? [])
        const allFixtures = allRounds.flatMap(round => round.fixtures ?? [])

        setMatches(allFixtures)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (competitionId) fetchMatches()
  }, [competitionId])

  return { matches, loading, error }
}
