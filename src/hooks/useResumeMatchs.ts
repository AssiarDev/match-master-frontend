import { useState, useEffect } from 'react'
import type { Match, Stage } from '../types'

export const useResumeMatchs = (competitionId?: number | string) => {
  const [matchs, setMatchs] = useState<Match[]>([])

  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`
        )
        if (!response.ok) throw new Error('Erreur lors du chargement des matchs')

        const data: Stage | Stage[] = await response.json()
        const stages = Array.isArray(data) ? data : [data]
        const allRounds = stages.flatMap(stage => stage.rounds ?? [])
        const allFixtures = allRounds.flatMap(round => round.fixtures ?? [])
        const finished = allFixtures.filter(f => f.state_id === 5)
        const sorted = finished.sort(
          (a, b) =>
            new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
        )
        setMatchs(sorted.slice(0, 5))
      } catch (e) {
        console.error('Erreur récupération des matchs', (e as Error).message)
      }
    }

    fetchMatchs()
  }, [competitionId])

  return matchs
}
