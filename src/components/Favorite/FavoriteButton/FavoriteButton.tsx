import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useFavorite } from "@/hooks/useFavorite";
import { useAddFavorite } from "@/hooks/useAddFavorite";
import { useDeleteFavorite } from "@/hooks/useDeleteFavorite";
import { useAddLeagueFavorite } from "@/hooks/useAddLeagueFavorite";
import { useLeagueFavorite } from "@/hooks/useLeagueFavorite";
import { useDeleteLeagueFavorite } from "@/hooks/useDeleteLeagueFavorite";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface FavoriteButtonProps {
  teamId?: number;
  teamName: string;
  competitionId?: number;
}

/**
 * Star button to add or remove a club or league from the user's favorites.
 * Redirects to login if the user is not authenticated.
 * Behavior is conditioned on `competitionId`: league logic when present, club logic otherwise.
 */
export const FavoriteButton = ({
  teamId,
  teamName,
  competitionId,
}: FavoriteButtonProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { favorite, refreshFavorites } = useFavorite();
  const { deleteFavorite } = useDeleteFavorite();
  const { addFavorite } = useAddFavorite();
  const { addLeagueFavorite } = useAddLeagueFavorite();
  const { leagueFavorite, refreshLeagueFavorites } = useLeagueFavorite();
  const { deleteLeagueFavorite } = useDeleteLeagueFavorite();

  const isFavorite = competitionId
    ? leagueFavorite.some((fav) => fav.id === competitionId)
    : favorite.some((fav) => fav.id === teamId);

  const handleClick = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (isFavorite) {
      competitionId
        ? await deleteLeagueFavorite(competitionId)
        : await deleteFavorite(teamId!);
    } else {
      competitionId
        ? await addLeagueFavorite(user.id, competitionId)
        : await addFavorite(user.id, teamId!, competitionId ?? 0);
    }
    refreshFavorites();
    refreshLeagueFavorites();
  };

  return (
    <>
      <button
        aria-label={`${teamName} à été ajouté aux favoris`}
        onClick={handleClick}
        className={`text-xl ${isFavorite ? "text-orange-400" : "text-gray-400"} cursor-pointer`}
      >
        {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </button>
    </>
  );
};
