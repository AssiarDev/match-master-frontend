import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorite } from "@/hooks/useFavorite";
import { useLeagueFavorite } from "@/hooks/useLeagueFavorite";
import type { Favorite } from "@/types";

/**
 * Shape of the favorites context.
 * - `favorite`: the authenticated user's favorite clubs
 * - `leagueFavorite`: the authenticated user's favorite leagues
 * - `error`: error message if the club favorites could not be loaded
 * - `refreshFavorites`: re-fetches the club favorites
 * - `refreshLeagueFavorites`: re-fetches the league favorites
 */
interface FavoritesContextValue {
  favorite: Favorite[];
  leagueFavorite: Favorite[];
  error: string | null;
  refreshFavorites: () => Promise<void>;
  refreshLeagueFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Fetches the user's club and league favorites once and shares them across the app,
 * so every FavoriteButton reads the same lists instead of fetching its own copy.
 * Must be rendered inside AuthProvider.
 *
 * Lists are emptied while no user is logged in: the provider stays mounted across
 * a logout, and useFetch keeps its last data when its url becomes null, so the
 * previous user's favorites would otherwise stay visible.
 */
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { favorite, error, refreshFavorites } = useFavorite();
  const { leagueFavorite, refreshLeagueFavorites } = useLeagueFavorite();

  return (
    <FavoritesContext.Provider
      value={{
        favorite: user ? favorite : [],
        leagueFavorite: user ? leagueFavorite : [],
        error,
        refreshFavorites,
        refreshLeagueFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

/** @throws if used outside FavoritesProvider */
export const useFavoritesContext = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error(
      "useFavoritesContext must be used inside FavoritesProvider",
    );
  return ctx;
};
