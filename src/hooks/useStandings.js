import { useEffect, useState } from "react";

export const useStandings = (competitionId) => {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/standings/${competitionId}`);
                if(!response.ok){
                    throw new Error('Erreur lors de la récupération des données');
                };
                const data = await response.json();
                setStandings(data);
            } catch (e){
                setError(e.message)
            } finally {
                setLoading(false)
            }
        };

        if(competitionId){
            fetchStandings()
        }
    }, [competitionId]);

    return { standings, loading, error}
};