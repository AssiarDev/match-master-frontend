import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Competitions = () => {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions`);
                if (!response.ok) throw new Error("Erreur lors du chargement des compétitions");
                const data = await response.json();
                setCompetitions(data);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };

        fetchCompetitions();
    }, [competitions]);

    return  (
        <div className="text-white flex justify-center mt-8">
            <div className="border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h1 className="text-2xl font-bold text-center mb-4">Top compétitions</h1>
                <ul className="space-y-4">
                    {competitions.map((competition) => (
                        <li key={competition.id} className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 transition">
                            <Link 
                                to={`/competition/${competition.id}`}
                                state={{ competition }} 
                                className="flex items-center gap-5 text-white text-lg font-semibold hover:underline"
                            >
                                <img className="h-10 w-10" src={competition.emblem} alt="" />
                                {competition.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );


};