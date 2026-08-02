import type { Match } from "../../types";
import { MatchCard } from "./MatchCard";

interface MatchsPreviewProps {
  matchs: Match[];
  onShowAll: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** Horizontal scrollable preview of the latest finished matches. Includes a link to the full match list. */
export const MatchsPreview = ({ matchs, onShowAll }: MatchsPreviewProps) => {
  if (!matchs?.length) {
    return (
      <div className="w-full border border-zinc-800 text-zinc-100 text-center py-6 rounded-lg shadow">
        <p className="text-zinc-500 text-center">
          La compétition n'a pas encore démarré.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg sm:text-xl">Derniers matchs</h1>
        <a
          href="#"
          onClick={onShowAll}
          className="text-blue-500 hover:underline text-sm sm:text-base"
        >
          Afficher tous les matchs
        </a>
      </div>

      <div className="flex overflow-x-auto gap-4 py-2 px-1 scrollbar-hide">
        {matchs.map((match) => (
          <div key={match.id} className="min-w-[280px] flex-shrink-0">
            <MatchCard item={match} />
          </div>
        ))}
      </div>
    </section>
  );
};
