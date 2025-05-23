export const Filtre = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="flex gap-4 mb-4">
            <button
                onClick={() => onFilterChange("upcoming")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                activeFilter === "upcoming" ? "bg-orange-800 text-white" : "bg-gray-300 text-black"
                }`}
            >
                À venir
            </button>
            <button
                onClick={() => onFilterChange("finished")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                activeFilter === "finished" ? "bg-orange-800 text-white" : "bg-gray-300 text-black"
                }`}
            >
                Terminé
            </button>
        </div>
    );
};