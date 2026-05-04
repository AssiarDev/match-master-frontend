import type { Competition } from '../types'
import { useFetch } from './useFetch'

/**
 * Fetches the list of available competitions.
 *
 * @returns `{ competitions, error }`
 */
export const useCompetitions = () => {
  const { data, error } = useFetch<Competition[]>(
    `${import.meta.env.VITE_API_URL}/competitions`
  )

  return { competitions: data ?? [], error }
}
