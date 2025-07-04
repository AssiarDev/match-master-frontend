import { MatchCard } from "./MatchCard";

export const MatchsPreview = ({ matchs, onShowAll}) => {
  if (!matchs?.length) {
  return (
    <div className="w-full border border-gray-800 text-white text-center py-6 rounded-lg shadow">
      <p className="text-gray-500 text-center">La compétition n'a pas encore démarré.</p>
    </div>
  );
}

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg sm:text-xl">Derniers matchs</h1>
        <a href="#" onClick={onShowAll} className="text-blue-500 hover:underline text-sm sm:text-base">
          Afficher tous les matchs
        </a>
      </div>

      <div className="flex overflow-x-auto gap-4 py-2 px-1 scrollbar-thin">
        {matchs.map((match) => (
          <div key={match.id} className="min-w-[280px] flex-shrink-0">
            <MatchCard item={match} />
          </div>
        ))}
      </div>
    </section>
  );
};