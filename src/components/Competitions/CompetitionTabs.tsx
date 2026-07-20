import { useState } from "react";
import { Resume } from "./Resume";
import { Classement } from "../Classement/Classement";
import { CompetitionMatchs } from "./CompetitionMatchs";
import { BracketView } from "../Bracket";
import type { Competition } from "../../types";

interface Tab {
  id: string;
  label: string;
}

const LEAGUE_TABS: Tab[] = [
  { id: "resume", label: "Résumé" },
  { id: "classement", label: "Classement" },
  { id: "matchs", label: "Matchs" },
];

const CUP_TABS: Tab[] = [
  { id: "resume", label: "Résumé" },
  { id: "bracket", label: "Tableau" },
  { id: "matchs", label: "Matchs" },
];

const isCup = (competition: Competition): boolean =>
  competition.sub_type?.includes("cup") ?? false;

interface CompetitionTabsProps {
  competition: Competition;
}

/** Tab navigation for a competition detail page — adapts to league (Classement) or cup (Bracket). */
export const CompetitionTabs = ({ competition }: CompetitionTabsProps) => {
  const [activeTab, setActiveTab] = useState("resume");
  const tabs = isCup(competition) ? CUP_TABS : LEAGUE_TABS;

  return (
    <div className="mt-4">
      <div className="flex justify-center gap-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-white px-4 py-2 rounded-md hover:bg-zinc-800 cursor-pointer ${
              activeTab === tab.id ? "bg-amber-950/50" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 text-white">
        {activeTab === "resume" && (
          <Resume competition={competition} setActiveTab={setActiveTab} />
        )}
        {activeTab === "classement" && <Classement />}
        {activeTab === "bracket" && <BracketView />}
        {activeTab === "matchs" && <CompetitionMatchs />}
      </div>
    </div>
  );
};
