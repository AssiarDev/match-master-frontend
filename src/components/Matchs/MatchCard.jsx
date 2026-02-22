
export const MatchCard = ({ item }) => {
  if (!item) return null;

  const home = item.participants?.find(p => p.meta?.location === "home");
  const away = item.participants?.find(p => p.meta?.location === "away");

  const formattedDate = new Date(item.starting_at).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const formattedTime = new Date(item.starting_at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const homeScore = item.scores?.ft_score?.home;
  const awayScore = item.scores?.ft_score?.away;

  const isFinished = item.state === "finished";

  return (
    <div className="border border-gray-700 rounded-xl shadow-md p-4 w-full max-w-sm min-w-[300px] bg-zinc-900 text-white transition duration-300 hover:shadow-lg hover:border-orange-800">
      <div className="flex items-center justify-between mb-4 gap-4">

        {/* Home Team */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={home?.image_path}
            alt={home?.short_code}
            className="w-14 h-14 rounded-full object-contain"
          />
          <p className="text-sm font-medium mt-2">{home?.short_code || home?.name}</p>
        </div>

        {/* VS + Date */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-400 mb-1">{formattedDate}</p>
          <p className="text-sm text-gray-400">{formattedTime}</p>
          <p className="text-lg font-semibold mt-2">VS</p>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={away?.image_path}
            alt={away?.short_code}
            className="w-14 h-14 rounded-full object-contain"
          />
          <p className="text-sm font-medium mt-2">{away?.short_code || away?.name}</p>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mt-2">
        <h3 className="text-sm font-semibold text-gray-400">Score</h3>

        {isFinished ? (
          <p className="text-2xl font-bold">
            {homeScore} - {awayScore}
          </p>
        ) : (
          <p className="text-md text-yellow-400 font-medium">À venir</p>
        )}
      </div>
    </div>
  );
};