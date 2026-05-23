import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";
import { useDeleteFavorite } from "../../hooks/useDeleteFavorite";
import { useLeagueFavorite } from "../../hooks/useLeagueFavorite";
import { useDeleteLeagueFavorite } from "../../hooks/useDeleteLeagueFavorite";

/** Modal displaying the user's favorite clubs and leagues, with navigation links and delete actions for each. */
export const FavoriteModal = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { favorite, error, refreshFavorites } = useFavorite();
  const { deleteFavorite } = useDeleteFavorite();
  const { leagueFavorite, refreshLeagueFavorites } = useLeagueFavorite();
  const { deleteLeagueFavorite } = useDeleteLeagueFavorite();

  const hasError = Boolean(error);

  const handleDelete = async (clubId: number) => {
    const result = await deleteFavorite(clubId);
    if (result?.message) {
      refreshFavorites();
    }
  };

  const handleDeleteLeague = async (leagueId: number) => {
    const result = await deleteLeagueFavorite(leagueId);
    if (result?.message) {
      refreshLeagueFavorites();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-neutral-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-neutral-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={() => {
              setOpen(false);
              navigate(-1);
            }}
            aria-label="Fermer le modal"
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            x
          </button>

          <DialogTitle className="text-xl font-bold text-white mb-5">
            Mes favoris
          </DialogTitle>

          <div>
            <p className="text-white font-semibold mb-2">Clubs</p>
            {hasError ? (
              <p className="text-red-500 text-sm text-center">{error}</p>
            ) : (
              favorite.map((fav, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center gap-2 border-white border-b mb-2"
                >
                  <img
                    src={fav.emblem}
                    alt={fav.name}
                    className="mb-2 h-5 w-5"
                  />
                  <Link
                    className="mb-2 text-white hover:underline"
                    to={`/teams/${fav.id}`}
                    state={{ selectedLeague: fav.leagueId }}
                  >
                    {fav.name}
                  </Link>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="ml-auto mr-2 cursor-pointer text-white hover:text-red-500"
                  >
                    x
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <p className="text-white font-semibold mb-2">Compétitions</p>
            {leagueFavorite.map((fav, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-2 border-white border-b mb-2"
              >
                <img src={fav.emblem} alt={fav.name} className="mb-2 h-5 w-5" />
                <Link
                  className="mb-2 text-white hover:underline"
                  to={`/competition/${fav.id}`}
                  state={{ competition: { ...fav, image_path: fav.emblem } }}
                >
                  {fav.name}
                </Link>
                <button
                  onClick={() => handleDeleteLeague(fav.id)}
                  className="ml-auto mr-2 cursor-pointer text-white hover:text-red-500"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
