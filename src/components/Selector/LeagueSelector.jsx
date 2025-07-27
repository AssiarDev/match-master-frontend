import { useState } from "react";
import { useNavigate } from "react-router";
import { useLeagues } from "../../hooks/useLeagues";
import { useTeamsByLeague } from "../../hooks/useTeamsByLeague";
import { useAddFavorite } from "../../hooks/useAddFavorite";
import { useAuth } from "../../context/AuthContext";

export const SelectorLeague = () => {

    const navigate = useNavigate();
    const [selectedLeague, setSelectedLeague] = useState('');
    const { leagues, loading: leaguesLoading } = useLeagues();
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const { teams, loading: teamsLoading } = useTeamsByLeague(selectedLeague);
    const { user } = useAuth();
    const { addFavorite } = useAddFavorite();
    

    const handleEnter = () => {
        if(!selectedLeague || !selectedTeamId){
            return alert("Veuillez sélectionner un championnat et une équipe.");
        };
        addFavorite(user.id, selectedTeamId)
        navigate(`/teams/${selectedTeamId}`, { state: { selectedLeague } });
    };

    return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-4 items-center mt-6">
        <select 
            value={selectedLeague} 
            onChange={(e) => setSelectedLeague(e.target.value)} 
            disabled={leaguesLoading}
            name="selected league" 
            className="w-full h-10 rounded border border-stone-800 bg-neutral-900 text-white focus:outline-none focus:border-amber-500"
        >
            {leagues.map((data, i) => (
                <option key={i} value={data.code} className="text-white">
                    {data.name}
                </option>
            ))}
        </select>

        <select 
            value={selectedTeamId} 
            onChange={(e) => setSelectedTeamId(e.target.value)}
            disabled={teamsLoading}
            name="selected teams"  
            className="w-full h-10 rounded border border-stone-800 bg-neutral-900 text-white focus:outline-none focus:border-amber-500"
        >
            {teams.map((team, i) => (
                <option key={i} value={team.id} className="text-white">{team.name}</option>
            ))}
        </select>
        <button 
            className="w-full sm:w-60 h-12 rounded-md bg-orange-700 hover:bg-orange-600 text-white text-lg cursor-pointer transition" 
            onClick={handleEnter}
        >
            Entrer
        </button>
    </div>  
    )
   
}