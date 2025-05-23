import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MatchCard } from "../Matchs/MatchCard";

export const Matchs = () => {
    const [matches, setMatches] = useState([]);
    const [visibleMatches, setVisibleMatches] = useState(6); // 🔹 Nombre de matchs visibles au départ
    const location = useLocation();
    const competition = location.state?.competition.id;

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${competition}/matches`);
                if (!response.ok) {
                    throw new Error("Impossible de récupérer les matchs");
                }
                const result = await response.json();
                setMatches(result.matches); // 🔥 Stocke tous les matchs sans filtre spécifique
            } catch (e) {
                console.error("Impossible de récupérer les infos sur les matchs", e.message);
            }
        };
        fetchMatches();
    }, [competition]);

    // 🔄 **Grouper les matchs par mois**
    const groupMatchesByMonth = (matches) => {
        return matches.reduce((acc, match) => {
            const matchDate = new Date(match.utcDate);
            const month = matchDate.toLocaleString("default", { month: "long" });
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(match);
            return acc;
        }, {});
    };

    // 🗂 **Tri des matchs du plus récent au plus ancien**
    const sortedMatches = matches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
    const groupedMatches = groupMatchesByMonth(sortedMatches);

    // 🔥 Fonction pour afficher plus de matchs
    const showMoreMatches = () => {
        setVisibleMatches((prev) => prev + 6); // 🔹 Charge 10 matchs supplémentaires
    };

    return (
        <div className="w-full flex flex-col items-center justify-center mt-5 mx-auto">
            <div className="flex flex-wrap justify-center items-center">
                {Object.keys(groupedMatches).length > 0 ? (
                    Object.keys(groupedMatches).map(month => {
                        const year = groupedMatches[month][0]
                            ? new Date(groupedMatches[month][0].utcDate).getFullYear()
                            : "";

                        return (
                            <div key={month} className="w-full mt-5 text-center">
                                {/* 📆 Titre du mois avec l'année */}
                                <div className="w-full">
                                    <h2 className="text-lg font-bold text-white ml-5 uppercase">
                                        {month} {year}
                                    </h2>
                                </div>

                                {/* 🏆 Affichage des matchs du mois */}
                                <div className="w-full mt-3 flex flex-wrap gap-4 justify-center items-center">
                                    {groupedMatches[month].slice(0, visibleMatches).map(match => (
                                        <MatchCard key={match.id} item={match} />
                                    ))}
                                </div>

                                {/* 🔹 Afficher plus si besoin */}
                                {groupedMatches[month].length > visibleMatches && (
                                    <button 
                                        onClick={showMoreMatches}
                                        className="mt-4 text-blue-500 hover:underline"
                                    >
                                        Afficher plus
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-600 mt-4">Aucun match disponible.</p>
                )}
            </div>
        </div>
    );
};