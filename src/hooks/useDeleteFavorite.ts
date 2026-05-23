import { useState } from "react";

/**
 * Removes a club from the authenticated user's favorites.
 *
 * @returns `{ deleteFavorite, error }`
 */
export const useDeleteFavorite = () => {
  const [error, setError] = useState<string | null>(null);

  const deleteFavorite = async (clubId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/protected/users/favorites/${clubId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la réponse.");

      const data = await response.json();
      return data;
    } catch (e) {
      setError(`Une erreur est survenue : ${e}`);
    }
  };

  return { deleteFavorite, error };
};
