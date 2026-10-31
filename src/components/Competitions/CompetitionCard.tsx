import { Link } from "react-router-dom";
import type { Competition } from "../../types";

interface CompetitionCardProps {
  competition: Competition;
}

/** List item card for a competition. Links to the competition detail page, passing competition data via route state. Without `image_path`, an empty logo-sized block keeps the names aligned instead of rendering a broken image. */
export const CompetitionCard = ({ competition }: CompetitionCardProps) => (
  <li className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 transition">
    <Link
      to={`/competition/${competition.id}`}
      state={{ competition }}
      className="flex items-center gap-4 sm:gap-5 text-zinc-100 text-base sm:text-lg font-semibold hover:underline"
    >
      {competition.image_path ? (
        <img
          className="h-10 w-10 object-contain"
          src={competition.image_path}
          alt={`Logo de ${competition.name}`}
        />
      ) : (
        <div className="h-10 w-10 shrink-0" aria-hidden="true" />
      )}
      {competition.name}
    </Link>
  </li>
);
