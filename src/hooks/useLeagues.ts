import { useState, useEffect } from 'react'
import type { League } from '../types'

export const useLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions`)
        if (!response.ok) throw new Error("Impossible d'acceder à la reponse")

        const result: Array<{ name?: string; id: number; emblem?: string }> =
          await response.json()

        const filteredLeague = result
          .filter(league => league.name)
          .map(league => ({
            name: league.name as string,
            code: league.id,
            logo: league.emblem,
          }))

        setLeagues(filteredLeague)
      } catch (error) {
        console.error('Error fetching data:', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchLeagues()
  }, [])

  return { leagues, loading }
}
