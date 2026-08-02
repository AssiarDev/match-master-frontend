import type { Match } from "../../types";
import { MatchCard } from "./MatchCard";

interface MonthgroupProps {
  label: string;
  matches?: Match[];
}

/** Renders a labeled section of match cards for a given month. */
export const Monthgroup = ({ label, matches = [] }: MonthgroupProps) => {
  return (
    <section className="w-full px-4">
      <h2 className="text-lg font-bold text-zinc-100 mb-2 mt-5">{label}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} item={match} />
        ))}
      </div>
    </section>
  );
};
