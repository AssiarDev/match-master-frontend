import { useEffect, useState } from 'react'
import type { Team } from '../types'

interface RawTeamItem {
  team?: {
    id: number
    name?: string
    image_path?: string
    short_code?: string
  }
}

export const useTeamsByLeague = (leagueId?: number | string) => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!leagueId) return

    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/teams`
        )
        const result: RawTeamItem[] = await response.json()

        if (!Array.isArray(result)) {
          console.error('Backend did not return an array:', result)
          setTeams([])
          return
        }

        const mapped = result
          .filter(item => item.team?.name)
          .map(item => ({
            id: item.team!.id,
            name: item.team!.name as string,
            image: item.team!.image_path ?? '',
            shortName: item.team!.short_code,
          }))

        setTeams(mapped)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [leagueId])

  return { teams, loading }
}
