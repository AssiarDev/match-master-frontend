export const ScorersCard = ({ playerName, goals }) => {
    return (
        <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="font-medium">{playerName}</span>
            <span className="font-bold">{goals} ⚽</span>
        </div>
    );
};