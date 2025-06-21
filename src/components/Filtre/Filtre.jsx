export const Filtre = ({ activeFilter, onFilterChange }) => {
  const options = [
    { label: "À venir", value: "upcoming" },
    { label: "Terminé", value: "finished" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 cursor-pointer ${
            activeFilter === value
              ? "bg-orange-800 text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};