// import { useState } from "react";
import { useLocation } from "react-router";
import { useMatches } from "../../hooks/useMatches";
import { groupMatchesByMonth } from "../../utils/groupMatchesByMonth";
import { MatchGroupByMonth } from "../Matchs/MatchGroupByMonth";

export const Matchs = () => {
  // const [visibleMatches, setVisibleMatches] = useState(6);
  const location = useLocation();
  const competition = location.state?.competition.id;

  const { matches, loading, error } = useMatches(competition);

// Tri des matchs du plus récent au plus ancien
  const sortedMatches = matches ? [...matches].sort(
    (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
  ) : [];

  const groupedMatches = groupMatchesByMonth(sortedMatches);

// Afficher les matchs par 6
  // const showMoreMatches = () => {
  //   setVisibleMatches((prev) => prev + 6);
  // };

  if (loading)
    return <p className="text-white text-center mt-5">Chargement des matchs...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-5">Erreur : {error}</p>;

  return (
    <div className="w-full flex flex-col items-center justify-center mt-5 px-4">
      <div className="w-full max-w-6xl">
        {Object.entries(groupedMatches).length > 0 ? (
          Object.entries(groupedMatches).map(([month, matches]) => (
            <MatchGroupByMonth
              key={month}
              month={month}
              matches={matches}
              // visibleMatches={visibleMatches}
              // onShowMore={showMoreMatches}
            />
          ))
        ) : (
          <p className="text-gray-400 mt-4 text-center">Aucun match disponible.</p>
        )}
      </div>
    </div>
  );
};