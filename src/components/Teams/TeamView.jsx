import { ClassmentThead } from "../Classement/ClassementThead";
import { ClassementTbody } from "../Classement/ClassementTbody";
import { ClassementLegende } from "../ClassementLegende/ClassementLegende";
import { MatchesList } from "../Matchs/MatchesList";

export const TeamView = ({ team, standings, teamId }) => (
  <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-4 py-6">
    <div className="flex justify-center items-center gap-3 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white text-xl sm:text-2xl font-semibold">
      <img src={team.emblem} alt={`${team.name} emblem`} className="h-10" />
      {team.name}
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-700 text-sm text-gray-200 rounded-lg shadow-lg">
        <ClassmentThead />
        {standings.map((item) => (
          <ClassementTbody key={item.position} item={item} teamId={teamId} />
        ))}
      </table>
    </div>

    <ClassementLegende />

    <div className="flex items-center justify-center gap-2 text-white text-lg sm:text-xl font-medium mt-4">
      <h1>Matchs du {team.name}</h1>
      <img src={team.emblem} alt={`${team.name} logo`} className="h-8" />
    </div>

    <MatchesList />
  </div>
);