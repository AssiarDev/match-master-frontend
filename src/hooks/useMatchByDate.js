import { useEffect, useState, useMemo } from "react";

export const useMatchByDate = (selectedDate) => {

    const [matchesData, setMatchesData] = useState({});
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/matches`);
                const allMatches = await response.json();

                const grouped = allMatches.reduce((acc, match) => {
                    const name = match.competition.name;
                    const flag = match.area?.flag || "";
                    if (!acc[name]) acc[name] = { flag, matches: [] };
                    acc[name].matches.push(match);
                    return acc;
                }, {});

                setMatchesData(grouped);
            } catch (err) {
                console.error("Une erreur est survenue :", err.message);
                setError(err.message);
            }
        }
    fetchMatches();
    }, [])

    const matchesByDate = useMemo(() => {
        if (!selectedDate || !matchesData) return {};

        return Object.entries(matchesData).reduce((acc, [compName, compData]) => {
        const filtered = compData.matches.filter(
            (m) => new Date(m.utcDate).toDateString() === new Date(selectedDate).toDateString()
        );

        if (filtered.length > 0) {
            acc[compName] = { flag: compData.flag, matches: filtered };
        }

        return acc;
        }, {});
    }, [matchesData, selectedDate]);

  return { matchesByDate, error}

}