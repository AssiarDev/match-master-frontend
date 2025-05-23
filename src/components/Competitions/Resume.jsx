import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MatchCard } from "../Matchs/MatchCard";
import { ClassmentThead } from "../Classement/ClassementThead";
import { ClassementTbody } from "../Classement/ClassementTbody";
import { ScorersCard } from "../Scorers/ScorersCard";

export const Resume = ({ setActiveTab }) => {
    const location = useLocation();
    const id = location.state?.competition.id;
    const [matchs, setMatchs] = useState([]);
    const [standings, setStandings] = useState([]);
    const [scorers, setScorers] = useState([]);

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/competitions/${id}/matches`);

                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la response');
                }

                const result = await response.json();
                console.log('result :', result)
                const finishedMatchs = result.matches.filter(match => match.status === "FINISHED");
                const sortedMatchs = finishedMatchs.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
                const last5Matchs = sortedMatchs.slice(0, 5);

                setMatchs(last5Matchs);

            } catch(e){
                console.error('Impossible de récupérer les infos sur les matches', e.message)
            }
        }
        fetchMatchs();
    }, [id]);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/standings/${id}`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la reponse');
                };
                const result = await response.json();
                setStandings(result)
            } catch(e){
                console.error('Error fetching data :', e.message)
            }
        }
        fetchStandings()
    }, [id]);

    const podiumTeams = standings.slice(0, 3); // récupérer les 3 premiers du classement

    useEffect(() => {
        const fetchTopScorers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/scorers/${id}`);
                if(!response.ok){
                    throw new Error('Impossible d\'acceder à la reponse');
                };

                const result = await response.json();
                setScorers(result)
            } catch(e){
                console.error('Error fetching data :', e.message)
            }
        }
        fetchTopScorers();
    }, [id])

    return (
        <div className="min-h-screen w-250 flex flex-col mx-auto gap-5">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-left self-start ">Derniers matchs</h1>
                <a href="#" 
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                        e.preventDefault(); 
                        setActiveTab("matchs");
                        }} 
                    >Afficher tous les matchs</a>
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex items-center overflow-x-auto flex-nowrap ">
                    {matchs.map(match => (
                        <MatchCard key={match.id} item={match}/>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold">Podium</h1>
                    <a href="#" 
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                        e.preventDefault(); 
                        setActiveTab("classement");
                        }} 
                    >Afficher tout le classement</a>
                </div>
                <table>
                    <ClassmentThead />
                    {podiumTeams.map(item => <ClassementTbody key={item.position} item={item} />)}
                </table>
            </div>
            <div className="flex flex-col gap-5">
                <h1 className="font-bold">Meilleurs buteurs</h1>
                <div className="p-4 border border-gray-800 rounded-lg">

                {scorers.length > 0 ? (
                    scorers.map((scorer) => (
                        <ScorersCard key={scorer.player.id} playerName={scorer.player.name} goals={scorer.goals} />
                    ))
                ) : (
                    <p className="text-gray-500">Aucun buteur disponible.</p>
                )}
            </div>
            </div>
        </div>
    );
};