import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useFavoritesContext } from "@/context/FavoritesContext";
import { useAddFavorite } from "@/hooks/useAddFavorite";
import { useDeleteFavorite } from "@/hooks/useDeleteFavorite";
import { useAddLeagueFavorite } from "@/hooks/useAddLeagueFavorite";
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
 * Behavior is conditioned on `teamId`: club logic when present, league logic otherwise.
 * For a club, `competitionId` is only the competition context sent along with the favorite;
 * for a league, it is the id of the league itself.
 * Favorite lists are read from FavoritesContext; after a change, only the affected list is re-fetched.
 */
export const FavoriteButton = ({
  teamId,
  teamName,
  competitionId,
}: FavoriteButtonProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { favorite, leagueFavorite, refreshFavorites, refreshLeagueFavorites } =
    useFavoritesContext();
  const { deleteFavorite } = useDeleteFavorite();
  const { addFavorite } = useAddFavorite();
  const { addLeagueFavorite } = useAddLeagueFavorite();
  const { deleteLeagueFavorite } = useDeleteLeagueFavorite();

  const isLeague = teamId === undefined;

  const isFavorite = isLeague
    ? leagueFavorite.some((fav) => fav.id === competitionId)
    : favorite.some((fav) => fav.id === teamId);

  const handleClick = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (isFavorite) {
      if (isLeague) {
        await deleteLeagueFavorite(competitionId!);
      } else {
        await deleteFavorite(teamId);
      }
    } else {
      if (isLeague) {
        await addLeagueFavorite(user.id, competitionId!);
      } else {
        await addFavorite(user.id, teamId, competitionId ?? 0);
      }
    }
    if (isLeague) {
      refreshLeagueFavorites();
    } else {
      refreshFavorites();
    }
  };

  return (
    <>
      <button
        aria-label={`${teamName} à été ajouté aux favoris`}
        onClick={handleClick}
        className={`text-xl ${isFavorite ? "text-amber-400" : "text-zinc-400"} cursor-pointer`}
      >
        {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </button>
    </>
  );
};
