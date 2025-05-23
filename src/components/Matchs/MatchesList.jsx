import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router";
import { MatchCard } from "./MatchCard";
import { Filtre } from "../Filtre/Filtre";

export const MatchesList = () => {
    const [matches, setMatches] = useState([]);
    const location = useLocation();
    const selectedLeague = location.state?.selectedLeague;
    const { teamId } = useParams();
    const [filter, setFilter] = useState('upcoming')

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${selectedLeague}/matches`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la reponse');
                }
                const result = await response.json();
                const matches = result.matches

                const filteredMatches = matches.filter(match =>
                    match.homeTeam.id === Number(teamId) || match.awayTeam.id === Number(teamId)
                );
                setMatches(filteredMatches)
            } catch(e){
                console.error('Impossible de récupérer les infos sur les matches', e.message)
            }
        }
        fetchMatches()
    }, [selectedLeague, teamId]);

    // Grouper les matchs filtrés par mois
    const groupMatchesByMonth = (filteredMatches) => {
        return filteredMatches.reduce((acc, match) => {
            const matchDate = new Date(match.utcDate);
            const month = matchDate.toLocaleString("default", { month: "long" }); // Extrait le nom du mois
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(match);
            return acc;
        }, {});
    };

    // Logique de filtrage des matchs
    const filteredMatches = matches
    .filter(match => {
        const matchDate = new Date(match.utcDate);
        const now = new Date();

        if (filter === "upcoming") {
            return matchDate > now; // "À venir"
        } else if (filter === "finished") {
            return matchDate <= now; // "Terminé"
        }
        return true; // Si aucun filtre, afficher tout
    })
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate)); // Tri du plus récent au plus ancien



    const groupedMatches = groupMatchesByMonth(filteredMatches);

    return (
        <div className="w-full flex flex-col mt-5">
            <div className="flex justify-center items-center">
                <Filtre activeFilter={filter} onFilterChange={setFilter} />
            </div>
            <div className="flex flex-wrap justify-center items-center">
            {Object.keys(groupedMatches).length > 0 ? (
    Object.keys(groupedMatches).map(month => {
        // Extraction de l'année à partir du premier match de chaque mois
        const year = groupedMatches[month][0] // On utilise le premier match du mois
            ? new Date(groupedMatches[month][0].utcDate).getFullYear()
            : "";

        return (
            <div key={month} className="w-full mt-5">
                {/* Section du titre du mois avec l'année */}
                <div className="w-full">
                    <h2 className="text-lg font-bold text-white ml-5">
                        {month} {year} {/* Affichage du mois suivi de l'année */}
                    </h2>
                </div>

                {/* Section des matchs du mois */}
                <div className="w-full mt-3 flex flex-wrap gap-4">
                    {groupedMatches[month].map(match => (
                        <MatchCard key={match.id} item={match} />
                    ))}
                </div>
            </div>
        );
    })
) : (
    <p className="text-gray-600 mt-4">Aucun match disponible pour cette catégorie.</p>
)}

            </div>
        </div>
    )
}