import { useAuth } from "@/context/AuthContext";
import { useFetch } from "./useFetch";
import { Favorite } from "@/types";

/**
 * Fetches the authenticated user's league favorites.
 *
 * @returns `{ leagueFavorite, error, refreshLeagueFavorites }`
 */
export const useLeagueFavorite = () => {
  const { user } = useAuth();

  const { data, error, refresh } = useFetch<Favorite[]>(
    user?.id
      ? `${import.meta.env.VITE_API_URL}/protected/users/${user.id}/favorites-leagues`
      : null,
    { fetchOptions: { credentials: "include" } },
  );

  return { leagueFavorite: data ?? [], error, refreshLeagueFavorites: refresh };
};
