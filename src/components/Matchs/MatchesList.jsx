import { useState } from "react"
import { useLocation, useParams } from "react-router";
import { Filtre } from "../Filtre/Filtre";
import { groupMatchesByMonth } from "../../utils/groupMatchesByMonth";
import { GroupedMatchesList } from "./GroupedMatchesList";
import { useFilteredMatchesByTeam } from "../../hooks/useFilteredMatchesByTeam";

export const MatchesList = () => {
    const location = useLocation();
    const selectedLeague = location.state?.selectedLeague;
    const { teamId } = useParams();
    const [filter, setFilter] = useState('upcoming');

    const allMatches = useFilteredMatchesByTeam(selectedLeague, teamId, filter);
    const grouped = groupMatchesByMonth(allMatches);
    
    return (
    <div className="w-full flex flex-col mt-5 px-4 max-w-6xl mx-auto">
      <div className="flex justify-center">
        <Filtre activeFilter={filter} onFilterChange={setFilter} />
      </div>
      <GroupedMatchesList groupedMatches={grouped} />
    </div>
  );

}