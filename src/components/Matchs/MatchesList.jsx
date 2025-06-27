import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { Filtre } from "../Filtre/Filtre";
import { groupMatchesByMonth } from "../../utils/groupMatchesByMonth";
import { GroupedMatchesList } from "./GroupedMatchesList";
import { useFilteredMatchesByTeam } from "../../hooks/useFilteredMatchesByTeam";

export const MatchesList = () => {
  const location = useLocation();
  const selectedLeague = location.state?.selectedLeague;
  const { teamId } = useParams();
  const [filter, setFilter] = useState("upcoming");

  const allMatches = useFilteredMatchesByTeam(selectedLeague, teamId, filter);
  const grouped = groupMatchesByMonth(allMatches);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 flex flex-col gap-6 mt-6 max-w-6xl mx-auto">
      <div className="w-full flex justify-center">
        <Filtre activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <GroupedMatchesList groupedMatches={grouped} />
    </div>
  );
};