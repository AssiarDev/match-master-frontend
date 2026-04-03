import { useState } from 'react'
import type { Match } from '../../types'
import { MatchCard } from './MatchCard'

interface MatchGroupByMonthProps {
  month: string
  matches?: Match[]
}

export const MatchGroupByMonth = ({ month, matches = [] }: MatchGroupByMonthProps) => {
  const [visibleMatches, setVisibleMatches] = useState(6)

  if (!Array.isArray(matches) || matches.length === 0) return null

  const handleShowMore = () => setVisibleMatches((prev) => prev + 6)

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-bold text-white uppercase mb-4 text-center">{month}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.slice(0, visibleMatches).map((match) => (
          <MatchCard key={match.id} item={match} />
        ))}
      </div>

      {matches.length > visibleMatches && (
        <div className="mt-4 text-center">
          <button onClick={handleShowMore} className="text-blue-500 hover:underline">
            Afficher plus
          </button>
        </div>
      )}
    </div>
  )
}