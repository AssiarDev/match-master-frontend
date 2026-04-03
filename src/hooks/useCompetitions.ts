import type { Competition } from '../types'
import { useFetch } from './useFetch'

export const useCompetitions = () => {
  const { data, error } = useFetch<Competition[]>(
    `${import.meta.env.VITE_API_URL}/competitions`
  )

  return { competitions: data ?? [], error }
}
