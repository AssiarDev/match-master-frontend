interface ScorersCardProps {
  playerName?: string
  goals?: number
  image?: string
}

export const ScorersCard = ({ playerName, goals, image }: ScorersCardProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
      <div className="flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={playerName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700" />
        )}
        <span className="font-medium">{playerName}</span>
      </div>
      <span className="font-bold">{goals} ⚽</span>
    </div>
  )
}