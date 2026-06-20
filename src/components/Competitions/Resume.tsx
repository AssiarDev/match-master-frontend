import { useLocation } from "react-router";
import { useResumeMatchs } from "../../hooks/useResumeMatchs";
import { useStandings } from "../../hooks/useStandings";
import { useScorers } from "../../hooks/useScorers";
import { MatchsPreview } from "../Matchs/MatchsPreview";
import { PodiumSection } from "./PodiumSection";
import { ScorersSection } from "../Scorers/ScorersSection";
import { BracketView } from "../Bracket";
import type { Competition } from "../../types";

interface ResumeProps {
  competition: Competition;
  setActiveTab: (tab: string) => void;
}

const isCup = (competition: Competition): boolean =>
  competition.sub_type?.includes("cup") ?? false;

export const Resume = ({ competition, setActiveTab }: ResumeProps) => {
  const location = useLocation();
  const id = location.state?.competition?.id;

  const matchs = useResumeMatchs(id);
  const { standings } = useStandings(!isCup(competition) ? id : undefined);
  const { scorers } = useScorers(!isCup(competition) ? id : undefined);

  const podiumTeams = standings.slice(0, 3);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <MatchsPreview
          matchs={matchs}
          onShowAll={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setActiveTab("matchs");
          }}
        />

        {isCup(competition) ? (
          <div>
            <h2 className="text-white font-semibold text-lg mb-3">Tableau</h2>
            <BracketView />
          </div>
        ) : (
          <>
            <PodiumSection
              podiumTeams={podiumTeams}
              onShowAll={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                setActiveTab("classement");
              }}
            />
            <ScorersSection scorers={scorers} />
          </>
        )}
      </div>
    </div>
  );
};
