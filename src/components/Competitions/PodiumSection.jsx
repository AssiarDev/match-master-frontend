import { ClassementTbody } from "../Classement/ClassementTbody";
import { ClassmentThead } from "../Classement/ClassementThead";

export const PodiumSection = ({ podiumTeams, onShowAll }) => {
    if(!podiumTeams?.length) return null;

    return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg sm:text-xl">Podium</h1>
        <a href="#" onClick={onShowAll} className="text-blue-500 hover:underline text-sm sm:text-base">
          Afficher tout le classement
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[340px] w-full text-sm sm:text-base">
          <ClassmentThead />
          {podiumTeams.map((team) => (
            <ClassementTbody key={team.position} item={team} />
          ))}
        </table>
      </div>
    </section>
    );
};