import { useCompetitions } from "../../hooks/useCompetitions";
import { CompetitionCard } from "./CompetitionCard";

export const Competitions = () => {

    const { competitions, error} = useCompetitions();

    if(error){
        return <p className="text-red-500 text-center">{error}</p>
    };

    return (
  <section className="w-full px-4 sm:px-6 mt-6 mb-10">
    <div className="max-w-3xl mx-auto border border-gray-700 rounded-lg shadow-lg p-5 sm:p-6 bg-zinc-900">
      <h1 className="text-xl sm:text-2xl font-bold text-center text-white mb-4">
        Top compétitions
      </h1>
      <ul className="space-y-3 sm:space-y-4">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </ul>
    </div>
</section>
  );

};