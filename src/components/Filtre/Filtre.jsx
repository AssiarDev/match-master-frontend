export const Filtre = ({ activeFilter, onFilterChange }) => {
  const options = [
    { label: "À venir", value: "upcoming" },
    { label: "Terminé", value: "finished" },
  ];

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 px-2">
      {options.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 ${
            activeFilter === value
              ? "bg-orange-800 text-white"
              : "bg-stone-300 text-black hover:bg-stone-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};