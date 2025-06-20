import { useState, useEffect } from "react";

export const useScorers = (competitionId) => {
    const [scorers, setScorers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!competitionId) return;

        const fetchScorers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/scorers/${competitionId}`);
                if(!response.ok){
                    throw new Error('Erreur API buteurs');
                }

                const data = await response.json();
                setScorers(data)
            } catch(e){
                console.error('useScorers :', e.message);
                setError(e.message)
            }
        }
    fetchScorers();
    }, [competitionId]);

    return { scorers, error}
}