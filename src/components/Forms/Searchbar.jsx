import { useEffect, useState } from "react";
import { Input } from "./Input";

const apiURL = import.meta.env.VITE_API_URL;

export const SearchBar = () => {

  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${apiURL}/teams`);
        const result = await response.json();
        const teams = result.map(team => ({
            name: team.name,
            logo: team.emblem
          }))
        setTeams(teams)
      } catch (e){
        console.error('Error fetching data:', e);
      };
    }
    fetchTeams()
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = teams
        .filter(team =>
        team.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredTeam(filtered);
    } else {
      setFilteredTeam([])
    }
  }, [query, teams]);

    return <div>
        <Input 
          type="text"
          value={query}
          onChange={handleSearch} 
          placeholder="Rechercher..."
          />
          {query && filteredTeam.length > 0 && (
            <ul className="absolute top-16 w-54 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
            {filteredTeam.map((item, i) => (
              <li key={i} className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center gap-2">
                <img src={item.logo} alt={item.name} className="w-5 h-5" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          )}
    </div>
}