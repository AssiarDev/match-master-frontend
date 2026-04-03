import { useLocation } from 'react-router'
import { useResumeMatchs } from '../../hooks/useResumeMatchs'
import { useStandings } from '../../hooks/useStandings'
import { useScorers } from '../../hooks/useScorers'
import { MatchsPreview } from '../Matchs/MatchsPreview'
import { PodiumSection } from './PodiumSection'
import { ScorersSection } from '../Scorers/ScorersSection'

interface ResumeProps {
  setActiveTab: (tab: string) => void
}

export const Resume = ({ setActiveTab }: ResumeProps) => {
  const location = useLocation()
  const id = location.state?.competition?.id

  const matchs = useResumeMatchs(id)
  const { standings } = useStandings(id)
  const { scorers } = useScorers(id)

  const podiumTeams = standings.slice(0, 3)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <MatchsPreview
          matchs={matchs}
          onShowAll={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            setActiveTab('matchs')
          }}
        />

        <PodiumSection
          podiumTeams={podiumTeams}
          onShowAll={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            setActiveTab('classement')
          }}
        />

        <ScorersSection scorers={scorers} />
      </div>
    </div>
  )
}