import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FavoriteTeamCard } from "./FavoriteTeamCard";
import { useNavigate } from "react-router";

export const SelectFavoriteTeam = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center bg-neutral-950 h-screen">
        <p className="text-white text-lg animate-pulse">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto bg-neutral-950 px-4 flex items-center justify-center">
      <FavoriteTeamCard />
    </div>
  );
};