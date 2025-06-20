import { MatchCard } from "./MatchCard";

export const Monthgroup = ({ label, matches = []}) => {
    const year = matches[0] ? new Date(matches[0].utcDate).getFullYear() : "";

    return (
    <section className="w-full mt-6">
      <h2 className="text-lg font-bold text-white ml-5">
        {label} {year}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {matches.map((match) => (
          <MatchCard key={match.id} item={match} />
        ))}
      </div>
    </section>

    )
}