import { useLocation } from "react-router";
import { useResumeMatchs } from "../../hooks/useResumeMatchs";
import { useStandings } from "../../hooks/useStandings";
import { useScorers } from "../../hooks/useScorers";
import { MatchsPreview } from "../Matchs/MatchsPreview";
import { PodiumSection } from "./PodiumSection";
import { ScorersSection } from "../Scorers/ScorersSection";

export const Resume = ({ setActiveTab }) => {
    const location = useLocation();
    const id = location.state?.competition?.id;

    const matchs = useResumeMatchs(id)
    const { standings } = useStandings(id);
    const { scorers } = useScorers(id);

    const podiumTeams = standings.slice(0, 3); // récupérer les 3 premiers du classement

    return (
        <div className="min-h-screen max-w-6xl w-full px-4 mx-auto flex flex-col gap-8 py-6">
            <MatchsPreview
                matchs={matchs}
                onShowAll={(e) => {
                e.preventDefault();
                setActiveTab("matchs");
            }}
            />

            <PodiumSection
                podiumTeams={podiumTeams}
                onShowAll={(e) => {
                e.preventDefault();
                setActiveTab("classement");
            }}
            />

            <ScorersSection scorers={scorers} />
    </div>

    );
};