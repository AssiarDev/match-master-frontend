import { useState, useEffect } from 'react'
import type { Scorer } from '../types'

interface ScorerPage extends Array<Scorer> {
  pagination?: {
    has_more: boolean
    next_page: number | null
  }
}

export const useScorers = (competitionId?: number | string) => {
  const [scorers, setScorers] = useState<Scorer[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!competitionId) return

    const fetchAllPages = async () => {
      try {
        let page: number | null = 1
        let allScorers: Scorer[] = []
        let hasMore = true

        while (hasMore) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/scorers/${competitionId}?page=${page}`
          )
          if (!response.ok) throw new Error('Erreur API buteurs')

          const result: ScorerPage = await response.json()
          allScorers = [...allScorers, ...(result ?? [])]

          const pagination = result.pagination
          hasMore = pagination?.has_more ?? false
          page = pagination?.next_page ?? null
        }
        setScorers(allScorers)
      } catch (e) {
        console.error('useScorers :', (e as Error).message)
        setError((e as Error).message)
      }
    }

    fetchAllPages()
  }, [competitionId])

  return { scorers, error }
}
