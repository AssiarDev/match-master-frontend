import { useEffect, useState } from 'react'
import type { StandingEntry } from '../types'

interface TeamDetail {
  id: number
  name: string
  image_path?: string
  short_code?: string
  [key: string]: unknown
}

export const useTeamDetails = (teamId?: number | string, leagueId?: number | string) => {
  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [standings, setStandings] = useState<StandingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, standingsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}`),
          fetch(`${import.meta.env.VITE_API_URL}/standings/${leagueId}`),
        ])

        if (!teamRes.ok || !standingsRes.ok) throw new Error('Erreur serveur')

        const teamData: TeamDetail = await teamRes.json()
        const standingsData: StandingEntry[] = await standingsRes.json()

        setTeam(teamData)
        setStandings(standingsData)
      } catch (e) {
        console.error('Erreur:', (e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (teamId && leagueId) fetchData()
  }, [teamId, leagueId])

  return { team, standings, loading }
}
