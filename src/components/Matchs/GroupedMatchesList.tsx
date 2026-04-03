import type { Match } from '../../types'
import { Monthgroup } from './MonthGroup'

interface GroupedMatchesListProps {
  groupedMatches: Record<string, Match[]>
}

export const GroupedMatchesList = ({ groupedMatches }: GroupedMatchesListProps) => {
  if (!groupedMatches || Object.keys(groupedMatches).length === 0) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Aucun match disponible pour cette catégorie.
      </p>
    )
  }

  return (
    <>
      {Object.entries(groupedMatches).map(([month, matches]) => (
        <Monthgroup key={month} label={month} matches={matches} />
      ))}
    </>
  )
}