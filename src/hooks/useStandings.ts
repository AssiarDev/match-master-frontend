import { useEffect, useState } from 'react'
import type { StandingEntry } from '../types'

export const useStandings = (competitionId?: number | string) => {
  const [standings, setStandings] = useState<StandingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/standings/${competitionId}`
        )
        if (!response.ok) throw new Error('Erreur lors de la récupération des données')

        const data: StandingEntry[] = await response.json()
        setStandings(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (competitionId) fetchStandings()
  }, [competitionId])

  return { standings, loading, error }
}
