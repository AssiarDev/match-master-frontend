import { SelectorLeague } from "./LeagueSelector";

export const FavoriteTeamCard = () => {
  return (
    <div className="w-full max-w-xl bg-neutral-900 border border-stone-700 rounded-lg shadow-md p-6 flex flex-col items-center gap-6">
      <h2 className="text-white text-2xl sm:text-3xl text-center font-semibold">
        Choisissez votre équipe favorite
      </h2>
      <div className="w-full">
        <label className="text-white text-sm sm:text-base mb-2 block text-center">
          Sélectionnez un championnat puis une équipe
        </label>
        <SelectorLeague />
      </div>
    </div>
  );
};