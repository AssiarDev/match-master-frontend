import { useState, useEffect } from 'react'
import type { Competition } from '../types'

export const useCompetitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions`)
        if (!response.ok) throw new Error('Erreur lors de la reponse.')

        const data: Competition[] = await response.json()
        setCompetitions(data)
      } catch (e) {
        console.error('Erreur fetch competitions :', e)
        setError((e as Error).message)
      }
    }
    fetchCompetitions()
  }, [])

  return { competitions, error }
}
