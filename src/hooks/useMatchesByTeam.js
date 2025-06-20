import { useState, useEffect } from "react";

export const useMatchesByTeam = (leagueId, teamId) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (!leagueId || !teamId) return;

        const fetchMatches = async () => {
        try {
            const res = await fetch(
            `${import.meta.env.VITE_API_URL}/competitions/${leagueId}/matches`
            );
            if (!res.ok) throw new Error("Erreur API");
            const data = await res.json();

            const teamMatches = data.matches.filter(
            (match) =>
                match.homeTeam.id === Number(teamId) ||
                match.awayTeam.id === Number(teamId)
            );

            setMatches(teamMatches);
        } catch (err) {
            console.error("useMatchesByTeam :", err.message);
        }
        };

    fetchMatches();
    }, [leagueId, teamId])

    return matches
};