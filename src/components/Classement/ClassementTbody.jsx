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

  const isSelected = teamId ? item.team_id === Number(teamId) : false;

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
          <img src={item.team_image} alt={item.team_name} className="h-5" />
          {item.team_name}
        </td>

        <td className="px-2 py-2 text-center">{item.points}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.played}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.won}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.draw}</td>
        <td className="px-2 py-2 text-center hidden sm:table-cell">{item.lost}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goals_for}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goals_against}</td>
        <td className="px-2 py-2 text-center hidden md:table-cell">{item.goal_diff}</td>
      </tr>
    </tbody>
  );
};