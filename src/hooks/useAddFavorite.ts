import { useState } from "react";

/**
 * Adds a club to the authenticated user's favorites.
 *
 * @returns `{ addFavorite, error }`
 */
export const useAddFavorite = () => {
  const [error, setError] = useState<string | null>(null);

  const addFavorite = async (
    userId: number,
    id: number | string,
    competitionId: number,
  ) => {
    const clubId = parseInt(String(id));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/protected/users/favorites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, clubId, competitionId }),
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la réponse.");

      const data = await response.json();
      return data;
    } catch (e) {
      setError(`Une erreur est survenue : ${e}`);
    }
  };

  return { addFavorite, error };
};
