export const ClassementTbody = ({ item, teamId = null }) => {
    if (!item) {
        return <p>Aucune donnée disponible pour le classement.</p>;
    }

    const isSelected = teamId ? item.team.id === Number(teamId) : false;


    // Définir les couleurs sous forme de bordure
    let borderColor = '';
    if (item.position <= 4) {  
        borderColor = 'border-l-4 border-blue-500'; // Ligue des Champions
    } else if (item.position === 5) {  
        borderColor = 'border-l-4 border-yellow-500'; // Europa League
    } else if (item.position === 6) {  
        borderColor = 'border-l-4 border-green-500'; // Conference League
    } else if (item.position === 16) {  
        borderColor = 'border-l-4 border-orange-500'; // Play-off de relégation
    } else if (item.position >= 17) {  
        borderColor = 'border-l-4 border-red-500'; // Relégation directe (19e et 20e places)
    }


    return (
        <tbody>
            <tr className={`justify-center ${isSelected ? 'bg-orange-800 text-white font-bold' : ''} ${borderColor}`}>
                <td className="px-4 py-2 text-center">{item.position}</td>
                <td className="px-2 py-2 text-center flex gap-2">
                    <img src={item.team.crest} alt={item.team.name} className="h-5"/> {item.team.shortName}
                </td>
                <td className="px-4 py-2 text-center">{item.points}</td>
                <td className="px-4 py-2 text-center">{item.playedGames}</td>
                <td className="px-4 py-2 text-center">{item.won}</td>
                <td className="px-4 py-2 text-center">{item.draw}</td>
                <td className="px-4 py-2 text-center">{item.lost}</td>
                <td className="px-4 py-2 text-center">{item.goalsFor}</td>
                <td className="px-4 py-2 text-center">{item.goalsAgainst}</td>
                <td className="px-4 py-2 text-center">{item.goalDifference}</td>
            </tr>
        </tbody>
    );
}