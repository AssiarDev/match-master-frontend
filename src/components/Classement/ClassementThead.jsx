export const ClassmentThead = () => {
  return (
    <thead className="bg-stone-800 text-white text-xs sm:text-sm">
      <tr>
        <th className="px-2 py-2 text-center">#</th>
        <th className="px-2 py-2 text-left">Équipe</th>
        <th className="px-2 py-2 text-center">Pts</th>
        <th className="px-2 py-2 text-center hidden sm:table-cell">J</th>
        <th className="px-2 py-2 text-center hidden sm:table-cell">G</th>
        <th className="px-2 py-2 text-center hidden sm:table-cell">N</th>
        <th className="px-2 py-2 text-center hidden sm:table-cell">D</th>
        <th className="px-2 py-2 text-center hidden md:table-cell">BP</th>
        <th className="px-2 py-2 text-center hidden md:table-cell">BC</th>
        <th className="px-2 py-2 text-center hidden md:table-cell">DIF</th>
      </tr>
    </thead>
  );
};