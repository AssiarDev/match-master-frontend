import type { Match, LiveMatch } from '../../types'
import { MatchCard } from '../Matchs/MatchCard'
import { LiveMatchCard } from '../LiveMatch/LiveMatchCard'

interface CompetitionGroupProps {
  name: string
  flag?: string
  leagueId?: number
  matches: Match[]
  liveMap?: Map<number, LiveMatch>
}

/** Groups and displays match cards under a competition name and flag on the home page. 
 * Renders LiveMatchCard for matches currently in progress. 
 */
export const CompetitionGroup = ({ name, flag, leagueId, matches, liveMap }: CompetitionGroupProps) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-2xl font-bold text-white">{name}</h2>
      {flag && <img src={flag} alt="" className="h-5" />}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {matches.map((match) => {
        const liveMatch = liveMap?.get(match.id)
        return liveMatch
          ? <LiveMatchCard key={match.id} match={liveMatch} />
          : <MatchCard key={match.id} item={match} leagueId={leagueId} />
      })}
    </div>
  </div>
)