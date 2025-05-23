import { useState } from "react";
import { Resume } from "./Resume";
import { Classement } from "./Classement";
import { Matchs } from "./Matchs";

const tabs = [
    { id: "resume", label: "Résumé" },
    { id: "classement", label: "Classement" },
    { id: "matchs", label: "Matchs" }
];

export const CompetitionTabs = () => {
    const [activeTab, setActiveTab] = useState('resume');

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
                {activeTab === "resume" && <Resume setActiveTab={setActiveTab}/>}
                {activeTab === "classement" && <Classement />}
                {activeTab === "matchs" && <Matchs />}
            </div>
        </div>
    );

}