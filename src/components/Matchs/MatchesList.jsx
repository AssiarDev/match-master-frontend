import { useState } from "react"
import { useLocation, useParams } from "react-router";
import { Filtre } from "../Filtre/Filtre";
import { groupMatchesByMonth } from "../../utils/groupMatchesByMonth";
import { GroupedMatchesList } from "./GroupedMatchesList";
import { useFilteredMatchesByTeam } from "../../hooks/useFilteredMatchesByTeam";
// import { useMatchesByTeam } from "../../hooks/useMatchesByTeam";
// import { Monthgroup } from "./MonthGroup";

export const MatchesList = () => {
    const location = useLocation();
    const selectedLeague = location.state?.selectedLeague;
    const { teamId } = useParams();
    const [filter, setFilter] = useState('upcoming');

    console.log('selected league :', selectedLeague)

    const allMatches = useFilteredMatchesByTeam(selectedLeague, teamId, filter);
    const grouped = groupMatchesByMonth(allMatches);

    console.log('Matches filtrés :', allMatches);
    console.log('Groupés :', grouped)

    // const filteredMatches = useMemo(() => {
    //     const now = new Date();
    //     return allMatches
    //     .filter(match => {
    //         const matchDate = new Date(match.utcDate);

    //         if(filter === "upcoming"){
    //             return matchDate > now
    //         } else if(filter === "finished"){
    //             return matchDate <= now
    //         }
    //         return true
    //     })
    //     .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
    // }, [allMatches, filter])

    

    return (
    <div className="w-full flex flex-col mt-5 px-4 max-w-6xl mx-auto">
      <div className="flex justify-center mb-6">
        <Filtre activeFilter={filter} onFilterChange={setFilter} />
      </div>
      <GroupedMatchesList groupedMatches={grouped} />
    </div>
  );

}