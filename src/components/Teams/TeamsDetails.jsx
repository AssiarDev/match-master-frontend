import { useParams, useLocation } from "react-router";
import { useTeamDetails } from "../../hooks/useTeamDetails";
import { TeamView } from "./TeamView";

export const TeamsDetails = () => {
  const { teamId } = useParams();
  const location = useLocation();
  const selectedLeague = location.state?.selectedLeague;

  const { team, standings, loading } = useTeamDetails(teamId, selectedLeague);

  if (loading || !team) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-lg animate-pulse">
        Chargement des infos de l’équipe...
      </div>
    );
  }

  return <TeamView team={team} standings={standings} teamId={teamId} />;
};