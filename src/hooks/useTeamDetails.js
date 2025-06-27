import { useEffect, useState } from "react";

export const useTeamDetails = (teamId, leagueId) => {
  const [team, setTeam] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, standingsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}`),
          fetch(`${import.meta.env.VITE_API_URL}/standings/${leagueId}`),
        ]);

        if (!teamRes.ok || !standingsRes.ok) throw new Error("Erreur serveur");

        const teamData = await teamRes.json();
        const standingsData = await standingsRes.json();

        setTeam(teamData);
        setStandings(standingsData);
      } catch (e) {
        console.error("Erreur:", e.message);
      } finally {
        setLoading(false);
      }
    };

    if (teamId && leagueId) fetchData();
  }, [teamId, leagueId]);

  return { team, standings, loading };
};