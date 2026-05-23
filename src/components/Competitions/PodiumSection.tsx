import type { StandingEntry } from "../../types";
import { ClassementTbody } from "../Classement/ClassementTbody";
import { ClassmentThead } from "../Classement/ClassementThead";

interface PodiumSectionProps {
  podiumTeams: StandingEntry[];
  onShowAll: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** Displays the top 3 teams of a competition standings with a link to the full standings tab. */
export const PodiumSection = ({
  podiumTeams,
  onShowAll,
}: PodiumSectionProps) => {
  if (!podiumTeams?.length) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg sm:text-xl">Podium</h1>
        <a
          href="#"
          onClick={onShowAll}
          className="text-blue-500 hover:underline text-sm sm:text-base"
        >
          Afficher tout le classement
        </a>
      </div>

      <div>
        <table className="w-full text-sm sm:text-base">
          <ClassmentThead />
          {podiumTeams.map((team) => (
            <ClassementTbody key={team.position} item={team} />
          ))}
        </table>
      </div>
    </section>
  );
};
