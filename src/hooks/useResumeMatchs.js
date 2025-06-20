import { useState, useEffect } from "react";

export const useResumeMatchs = (competitionId) => {
    const [matchs, setMatchs] = useState([]);

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${competitionId}/matches`);
                if(!response.ok){
                    throw new Error('Erreur lors du chargement des matchs');
                }
                const { matches = [] } = await response.json();
                const finished = matches.filter((m) => m.status === 'FINISHED');
                const sorted = finished.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
                setMatchs(sorted.slice(0, 5))
            } catch(e){
                console.error('Erreur récupération des matchs', e.message)
            }
        }
        fetchMatchs();
    }, [competitionId])

    return matchs
};