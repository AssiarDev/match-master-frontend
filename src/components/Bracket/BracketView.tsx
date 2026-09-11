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

/**
 * Tableau éliminatoire d'une coupe : tours préliminaires en liste, phases finales en schéma visuel.
 *
 * The available sub-tabs depend on stages fetched asynchronously, so the active
 * tab is derived rather than stored: a tab selected earlier (or defaulted while
 * loading) may no longer exist once the data arrives. Falling back to the first
 * available tab prevents rendering a tab with no stages to display.
 */
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

  const [selectedSubTab, setSelectedSubTab] = useState<SubTab | null>(null);
  const activeSubTab =
    selectedSubTab !== null && availableTabs.includes(selectedSubTab)
      ? selectedSubTab
      : availableTabs[0];

  if (loading) {
    return (
      <p className="text-center text-zinc-400 py-8">Chargement du tableau…</p>
    );
  }

  if (error || stages.length === 0) {
    return (
      <p className="text-center text-zinc-400 py-8">
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
              onClick={() => setSelectedSubTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeSubTab === tab
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-100"
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
