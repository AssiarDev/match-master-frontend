import { useAuth } from "../../context/AuthContext";
import { FavoriteTeamCard } from "./FavoriteTeamCard";

export const SelectFavoriteTeam = () => {

    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
        <div className="flex items-center justify-center bg-neutral-950">
            <p className="text-white text-lg animate-pulse">Chargement...</p>
        </div>
        );
    }

    return (
    <div className="w-full overflow-y-auto bg-neutral-950 px-4 flex items-center justify-center">
      <FavoriteTeamCard />
    </div>
  );
}