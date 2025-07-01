import { useLocation } from "react-router"
import { CompetitionTabs } from "./CompetitionTabs";

export const CompetitionsDetails = () => {

    const location = useLocation();
    const competition = location.state?.competition;

    return (
        <div className="w-full flex flex-col ">
            <div className="bg-gradient-to-b from-neutral-950 to-zinc-900 flex flex-col justify-center items-center gap-3 pb-5">
                <img className="h-15 w-15 rounded-sm" src={competition.emblem} alt="" />
                <h1 className="text-white uppercase font-bold">{competition.name}</h1>
            </div>
            <div>
                <CompetitionTabs />
            </div>
        </div>
    );
};