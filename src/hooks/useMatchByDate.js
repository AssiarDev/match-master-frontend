import { useEffect, useState } from "react";

export const useMatchByDate = (selectedDate) => {
  const [matchesByDate, setMatchesByDate] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };


  useEffect(() => {
    if (!selectedDate) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);

        const formattedDate = formatDate(selectedDate)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/competitions/matches?date=${formattedDate}`
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer les matchs");
        }

        const json = await response.json();

        setMatchesByDate(json.data || {});
      } catch (err) {
        console.error("Erreur front :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedDate]);

  return { matchesByDate, loading, error };
};