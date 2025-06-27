import { useLocation } from "react-router";
import { useStandings } from "../../hooks/useStandings";
import { ClassementTable } from "./ClassementTable";

export const Classement = () => {
  const location = useLocation();
  const competitionId = location.state?.competition?.id;
  const { standings, loading, error } = useStandings(competitionId);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-600">Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-red-500">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl overflow-x-auto">
        <ClassementTable standings={standings} />
      </div>
    </div>
  );
};