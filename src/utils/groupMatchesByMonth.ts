import type { Match } from '../types'

export const groupMatchesByMonth = (matches: Match[]): Record<string, Match[]> => {
  return matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = new Date(match.starting_at)
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    const key = `${month} ${year}`
    if (!acc[key]) acc[key] = []
    acc[key].push(match)
    return acc
  }, {})
}
