import { useState, useEffect } from "react";

export const useMatches = (competitionId) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`);
                if (!response.ok){
                    throw new Error('Impossible de récupérer les matchs');
                };
                const data = await response.json();
                console.log('data matches :', data.matches)
                setMatches(data.matches || []);
            } catch(e){
                setError(e.message)
            } finally {
                setLoading(false)
            };
        };

        if(competitionId){
            fetchMatches();
        };
    }, [competitionId]);

    return { matches, loading, error}
};