import { useLocation } from "react-router";
import { useStandings } from "../../hooks/useStandings";
import { ClassementTable } from "./ClassementTable";

export const Classement = () => {
    const location = useLocation();
    const competitionId = location.state?.competition.id;
    const { standings, loading, error} = useStandings(competitionId);

    if(loading){
        return <p className="text-center text-gray-600">Chargement en cours...</p>
    };

    if(error){
        return <p className="text-center text-red-500">Erreur : {error}</p>
    };

    return (
        <div className="px-2 sm:px-4 md:px-8 py-4 w-full flex justify-center">
            <div className="overflow-x-auto max-w-full">
                <ClassementTable standings={standings} />
            </div>
        </div>
    );
};