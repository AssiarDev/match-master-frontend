import { ScorersCard } from "./ScorersCard";

export const ScorersSection = ({ scorers }) => {
    return (
    <section className="flex flex-col gap-4">
      <h1 className="font-bold text-lg sm:text-xl">Meilleurs buteurs</h1>

      <div className="p-4 border border-gray-800 rounded-lg flex flex-col gap-2">
        {scorers.length > 0 ? (
          scorers.map((scorer) => (
            <ScorersCard
              key={scorer.player.id}
              playerName={scorer.player.name}
              goals={scorer.goals}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">Aucun buteur disponible.</p>
        )}
      </div>
    </section>
    );
};