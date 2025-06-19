import { useState, useEffect } from "react";

export const useCompetitions = () => {
    const [competitions, setCompetitions] = useState([]);
    const  [error, setSerror] = useState(null);

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {

                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions`);
                if(!response.ok){
                    throw new Error('Erreur lors de la reponse.')
                };
                const data = await response.json();
                setCompetitions(data);

            } catch(e){
                setSerror(e.message);
            }
        }
        fetchCompetitions();
    }, []);

    return { competitions, error }
}