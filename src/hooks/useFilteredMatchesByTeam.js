import { useEffect, useState, useMemo } from "react";

export const useFilteredMatchesByTeam = (leagueId, teamId, filter) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if(!leagueId || !teamId) return;

        const fetchMatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`);

                if(!response.ok) throw new Error('Erreur API');
                const data = await response.json();
                console.log('Raw API response :', data)

                const filtered = data.matches.filter(
                    (match) =>
                    match.homeTeam.id === Number(teamId) ||
                    match.awayTeam.id === Number(teamId)
                );
                console.log(filtered)
                setMatches(filtered)
            } catch(e) {
                console.error('Une erreur esr survenue :', e.message)
            }
        }
    fetchMatches();
    }, [leagueId, teamId]);

    const filteredMatches = useMemo(() => {
    const now = new Date();
    return matches
      .filter((match) => {
        const matchDate = new Date(match.utcDate);
        if (filter === "upcoming") return matchDate > now;
        if (filter === "finished") return matchDate <= now;
        return true;
      })
      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
    }, [matches, filter]);

  return filteredMatches;
}