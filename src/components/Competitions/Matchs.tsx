import { useLocation } from 'react-router'
import type { Match } from '../../types'
import { useMatches } from '../../hooks/useMatches'
import { groupMatchesByMonth } from '../../utils/groupMatchesByMonth'
import { MatchGroupByMonth } from '../Matchs/MatchGroupByMonth'

export const Matchs = () => {
  const location = useLocation()
  const competition = location.state?.competition.id

  const { matches, loading, error } = useMatches(competition)

  const sortedMatches: Match[] = matches
    ? [...matches].sort(
        (a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
      )
    : []

  const groupedMatches = groupMatchesByMonth(sortedMatches)

  if (loading)
    return <p className="text-white text-center mt-5">Chargement des matchs...</p>
  if (error)
    return <p className="text-red-500 text-center mt-5">Erreur : {error}</p>

  return (
    <div className="w-full flex flex-col items-center justify-center mt-5 px-4">
      <div className="w-full max-w-6xl">
        {Object.entries(groupedMatches).length > 0 ? (
          Object.entries(groupedMatches).map(([month, matches]) => (
            <MatchGroupByMonth key={month} month={month} matches={matches} />
          ))
        ) : (
          <p className="text-gray-400 mt-4 text-center">Aucun match disponible.</p>
        )}
      </div>
    </div>
  )
}