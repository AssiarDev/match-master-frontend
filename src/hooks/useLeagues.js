import { useState, useEffect } from "react";

export const useLeagues = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions`);
                if(!response.ok){
                    throw new Error('Impossible d\'acceder à la reponse');
                }
                const result = await response.json();
                // Je filtre result pour récupérer les noms des ligues et 
                // je fais une copie avec map pour obtenir les noms dans un nouveau tableau
                const filteredLeague = result
                    .filter(league => league.name)
                    .map(league => ({
                        name: league.name,
                        code: league.id, 
                        logo: league.emblem
                }));
                setLeagues(filteredLeague);
                } catch (error) {
                console.error('Error fetching data:', error.message);
                } finally {
                    setLoading(false)
                }
        }
    fetchLeagues();
    },[]);

    return { leagues, loading };
};