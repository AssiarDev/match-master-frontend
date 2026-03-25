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
                .filter(item => item.team?.name)
                .map(item => ({
                    id: item.team.id,
                    name: item.team.name,
                    image: item.team.image_path,
                    shortName: item.team.short_code,
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