import { MatchCard } from "../Matchs/MatchCard";

export const CompetitionGroup = ({ name, flag, matches }) => (
  <div className="mb-8">
    <div className="flex  gap-3 text-center mb-4">
      <h2 className="text-2xl font-bold text-white">{name}</h2>
      {flag && <img src={flag} alt="" className="h-5" />}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
      {matches.map((match) => (
        <MatchCard key={match.id} item={match} />
      ))}
    </div>
  </div>
);