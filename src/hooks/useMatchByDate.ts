import type { MatchesByLeague } from '../types'
import { useFetch } from './useFetch'

const formatDate = (date: Date | string): string =>
  new Date(date).toISOString().split('T')[0]

export const useMatchByDate = (selectedDate?: Date | string | null) => {
  const formattedDate = selectedDate ? formatDate(selectedDate) : null

  const { data, loading, error } = useFetch<{ data?: MatchesByLeague }>(
    formattedDate
      ? `${import.meta.env.VITE_API_URL}/competitions/matches?date=${formattedDate}`
      : null
  )

  return { matchesByDate: data?.data ?? {}, loading, error }
}
