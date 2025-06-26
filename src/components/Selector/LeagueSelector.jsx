import { useState } from "react";
import { useNavigate } from "react-router";
import { useLeagues } from "../../hooks/useLeagues";
import { useTeamsByLeague } from "../../hooks/useTeamsByLeague";


export const SelectorLeague = () => {

    const navigate = useNavigate();
    const [selectedLeague, setSelectedLeague] = useState('');
    const { leagues, loading: leaguesLoading } = useLeagues();
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const { teams, loading: teamsLoading } = useTeamsByLeague(selectedLeague);

    const handleEnter = () => {
        if(!selectedLeague || !selectedTeamId){
            return alert("Veuillez sélectionner un championnat et une équipe.");
        };
        navigate(`/teams/${selectedTeamId}`, { state: { selectedLeague } });
    };

    return (
    <div className="flex flex-col gap-3 w-full items-center">
        <select 
            value={selectedLeague} 
            onChange={(e) => setSelectedLeague(e.target.value)} 
            disabled={leaguesLoading}
            name="selected league" 
            className="border border-stone-800 rounded-sm text-white w-80 h-10"
        >
            {leagues.map((data, i) => (
                <option key={i} value={data.code} className="text-black">
                    {data.name}
                </option>
            ))}
        </select>

        <select 
            value={selectedTeamId} 
            onChange={(e) => setSelectedTeamId(e.target.value)}
            disabled={teamsLoading}
            name="selected teams"  
            className="border border-stone-800 rounded-sm text-white w-80 h-10"
        >
            {teams.map((team, i) => (
                <option key={i} value={team.id} className="text-black">{team.name}</option>
            ))}
        </select>
        <button className="border border-stone-800 bg-orange-700 hover:bg-orange-600 w-60 h-15 rounded-md text-white text-xl cursor-pointer" onClick={handleEnter}>Entrer</button>
    </div>  
    )
   
}