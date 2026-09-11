import { useOptimistic, useTransition } from "react";
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
 *
 * The star is optimistic: `useOptimistic` shows the toggled state as soon as the user clicks,
 * for as long as the transition runs. The transition awaits both the request and the re-fetch,
 * so when it ends the star falls back to the real state computed from the reloaded list:
 * unchanged if the request succeeded, reverted if it failed, with no rollback code.
 * The button stays disabled while the transition is pending, so a quick second click
 * cannot race the first request.
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
  const [isPending, startTransition] = useTransition();

  const isLeague = teamId === undefined;

  const isFavorite = isLeague
    ? leagueFavorite.some((fav) => fav.id === competitionId)
    : favorite.some((fav) => fav.id === teamId);

  const [optimisticIsFavorite, setOptimisticIsFavorite] =
    useOptimistic(isFavorite);

  const handleClick = () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    startTransition(async () => {
      setOptimisticIsFavorite(!isFavorite);
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
        await refreshLeagueFavorites();
      } else {
        await refreshFavorites();
      }
    });
  };

  return (
    <>
      <button
        aria-label={`${teamName} à été ajouté aux favoris`}
        onClick={handleClick}
        disabled={isPending}
        className={`text-xl ${optimisticIsFavorite ? "text-amber-400" : "text-zinc-400"} cursor-pointer disabled:cursor-wait`}
      >
        {optimisticIsFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </button>
    </>
  );
};
