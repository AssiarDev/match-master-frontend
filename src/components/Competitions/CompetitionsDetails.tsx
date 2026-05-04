import { useLocation } from 'react-router'
import { CompetitionTabs } from './CompetitionTabs'
import type { Competition } from '../../types'
import { FavoriteButton } from '../Favorite/FavoriteButton'

/** Competition detail page: logo, name, favorite button, and tabbed content (Resume, Classement, Matchs). */
export const CompetitionsDetails = () => {
  const location = useLocation()
  const competition: Competition = location.state?.competition

  return (
    <div className="w-full flex flex-col">
      <div className="bg-gradient-to-b from-neutral-950 to-zinc-900 flex flex-col justify-center items-center gap-2 py-3">
        <div className="h-20 w-20 flex items-center justify-center">
          <img
            className="max-h-full max-w-full rounded-sm"
            src={competition.image_path}
            alt=""
          />
        </div>
        <h1 className="text-white uppercase font-bold">{competition.name}</h1>
        <FavoriteButton teamName={competition.name} competitionId={competition.id} />
      </div>
      <CompetitionTabs />
    </div>
  )
}