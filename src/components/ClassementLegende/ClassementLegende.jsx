export const ClassementLegende = () => {
    return (
        <div className="p-4 bg-neutral-950-100">
            <h2 className="text-sm font-bold mb-2">Légende du Classement</h2>
            <ul className="space-y-2">
                <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 inline-block mr-2"></span>
                    <span className="text-sm">Qualifié pour la Ligue des Champions</span>
                </li>
                <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 inline-block mr-2"></span>
                    <span className="text-sm">Qualifié pour l'Europa League</span>
                </li>
                <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 inline-block mr-2"></span>
                    <span className="text-sm">Qualifié pour la Conference League</span>
                </li>
                <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 inline-block mr-2"></span>
                    <span className="text-sm">Play-off de relégation</span>
                </li>
                <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 inline-block mr-2"></span>
                    <span className="text-sm">Relégation directe</span>
                </li>
            </ul>
        </div>
    );
};