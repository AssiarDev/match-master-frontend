import { Link } from 'react-router-dom'
import type { Competition } from '../../types'

interface CompetitionCardProps {
  competition: Competition
}

export const CompetitionCard = ({ competition }: CompetitionCardProps) => (
  <li className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 transition">
    <Link
      to={`/competition/${competition.id}`}
      state={{ competition }}
      className="flex items-center gap-4 sm:gap-5 text-white text-base sm:text-lg font-semibold hover:underline"
    >
      <img
        className="h-10 w-10 object-contain"
        src={competition.image_path || 'Aucun logo disponible.'}
        alt={`Logo de ${competition.name}`}
      />
      {competition.name}
    </Link>
  </li>
)