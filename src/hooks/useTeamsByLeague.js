import { useEffect, useState } from "react";

export const useTeamsByLeague = (leagueId) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!leagueId) return;

        const fetchTeams = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${leagueId}/teams`);
                const result = await response.json();

                if (!Array.isArray(result)) {
                    console.error("Backend did not return an array:", result);
                    setTeams([]);
                    return;
                }

                const teams = result
                .filter(team => team.name)
                .map(team => ({
                    id: team.id,
                    name: team.name,
                    image: team.image,
                    shortName: team.shortName,
                }));

                setTeams(teams)
            } catch (error){
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        }
    fetchTeams()
    }, [leagueId]);

    return { teams, loading};
};