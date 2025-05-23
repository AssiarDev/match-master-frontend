export const MatchCard = ({item}) => {
    return <div className="border-gray-700 border rounded-lg shadow-md p-4 m-4 w-80 min-w-[350px]">
        <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
                <img 
                    src={item.homeTeam.crest} 
                    alt={item.homeTeam.shortName}
                    className="w-16 h-16 rounded-full"
                    />
                <p className="text-sm font-medium mt-2 text-white">{item.homeTeam.shortName}</p>
            </div>
            <p className="text-lg font-bold text-white text-center">VS</p>
            <div className="flex flex-col items-center flex-grow">
                <img 
                    src={item.awayTeam.crest} 
                    alt={item.awayTeam.shortName}
                    className="w-16 h-16 rounded-full"
                    />
                <p className="text-sm font-medium mt-2 text-white">{item.awayTeam.shortName}</p>
            </div>
        </div>
        <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white">Score</h3>
            <p className="text-xl font-bold text-white">{item.score.fullTime.home}-{item.score.fullTime.away}</p>
        </div>
        <div className="text-center text-white">
            <p>{new Date(item.utcDate).toLocaleDateString()}</p>
            <p>{new Date(item.utcDate).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p>
        </div>
    </div>
} 