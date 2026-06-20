import { useState } from "react";
import { useLocation } from "react-router";
import { useBracket } from "../../hooks/useBracket";
import { BRACKET_MAX_MATCHES } from "../../utils/constants";
import { ToursTab } from "./ToursTab";
import { SchemaTab } from "./SchemaTab";

type SubTab = "tours" | "schema";

const SUB_TAB_LABELS: Record<SubTab, string> = {
  tours: "Tours préliminaires",
  schema: "Schéma",
};

/** Tableau éliminatoire d'une coupe : tours préliminaires en liste, phases finales en schéma visuel. */
export const BracketView = () => {
  const location = useLocation();
  const competition = location.state?.competition;
  const id: number | undefined = competition?.id;

  const { stages, loading, error } = useBracket(id);

  const earlyStages = stages.filter(
    (s) => s.matches.length > BRACKET_MAX_MATCHES,
  );
  const bracketStages = stages.filter(
    (s) => s.matches.length <= BRACKET_MAX_MATCHES,
  );

  const availableTabs: SubTab[] = [
    ...(earlyStages.length > 0 ? (["tours"] as SubTab[]) : []),
    ...(bracketStages.length > 0 ? (["schema"] as SubTab[]) : []),
  ];

  const [activeSubTab, setActiveSubTab] = useState<SubTab>(
    availableTabs[0] ?? "schema",
  );

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-8">Chargement du tableau…</p>
    );
  }

  if (error || stages.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        Aucune donnée de tableau disponible.
      </p>
    );
  }

  return (
    <div className="w-full">
      {availableTabs.length > 1 && (
        <div className="flex gap-4 border-b border-zinc-700 mb-4">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeSubTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {SUB_TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      )}

      {activeSubTab === "tours" && (
        <ToursTab stages={earlyStages} competitionId={id} />
      )}
      {activeSubTab === "schema" && <SchemaTab stages={bracketStages} />}
    </div>
  );
};
