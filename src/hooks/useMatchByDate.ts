import { useEffect, useState } from 'react'
import type { MatchesByLeague } from '../types'

export const useMatchByDate = (selectedDate?: Date | string | null) => {
  const [matchesByDate, setMatchesByDate] = useState<MatchesByLeague>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const formatDate = (date: Date | string): string => {
    return new Date(date).toISOString().split('T')[0]
  }

  useEffect(() => {
    if (!selectedDate) return

    const fetchMatches = async () => {
      try {
        setLoading(true)
        const formattedDate = formatDate(selectedDate)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/matches?date=${formattedDate}`
        )
        if (!response.ok) throw new Error('Impossible de récupérer les matchs')

        const json = await response.json()
        setMatchesByDate(json.data ?? {})
      } catch (err) {
        console.error('Erreur front :', err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [selectedDate])

  return { matchesByDate, loading, error }
}
