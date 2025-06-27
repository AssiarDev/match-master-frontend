export const ClassementTbody = ({ item, teamId = null }) => {
  if (!item) {
    return (
      <tbody>
        <tr>
          <td colSpan={10} className="text-center text-gray-400 py-4">
            Aucune donnée disponible pour le classement.
          </td>
        </tr>
      </tbody>
    );
  }

  const isSelected = teamId ? item.team.id === Number(teamId) : false;

  let borderColor = '';
  if (item.position <= 4) borderColor = 'border-l-4 border-blue-500';
  else if (item.position === 5) borderColor = 'border-l-4 border-yellow-500';
  else if (item.position === 6) borderColor = 'border-l-4 border-green-500';
  else if (item.position === 16) borderColor = 'border-l-4 border-orange-500';
  else if (item.position >= 17) borderColor = 'border-l-4 border-red-500';

  return (
    <tbody>
      <tr
        className={`text-xs sm:text-sm ${
          isSelected ? 'bg-orange-800 text-white font-bold' : ''
        } ${borderColor}`}
      >
        <td className="px-2 py-2 text-center">{item.position}</td>

        <td className="px-2 py-2 text-left flex items-center gap-2 whitespace-nowrap">
          <img src={item.team.crest} alt={item.team.name} className="h-5" />
          {item.team.shortName}
        </td>

        <td className="px-2 py-2 text-center">{item.points}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.playedGames}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.won}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.draw}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.lost}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goalsFor}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goalsAgainst}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goalDifference}</td>
      </tr>
    </tbody>
  );
};