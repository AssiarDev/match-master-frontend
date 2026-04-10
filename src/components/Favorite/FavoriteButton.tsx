import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router"
import { useFavorite } from "@/hooks/useFavorite"
import { useAddFavorite } from "@/hooks/useAddFavorite"
import { useDeleteFavorite } from "@/hooks/useDeleteFavorite"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"

interface FavoriteButtonProps {
    teamId: number
    teamName: string
    competitionId?: number
}

export const FavoriteButton = ({ teamId, teamName, competitionId }: FavoriteButtonProps) => {
    const { isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const { favorite, refreshFavorites } = useFavorite()
    const { deleteFavorite } = useDeleteFavorite()
    const { addFavorite } = useAddFavorite()

    const isFavorite = favorite.some(fav => fav.id === teamId)

    const handleClick = async () => {
        if (!isAuthenticated || !user) {
            navigate('/login')
            return
        }

        if (isFavorite) {
            await deleteFavorite(teamId)
        } else {
            await addFavorite(user.id, teamId, competitionId ?? 0)
        }
        refreshFavorites()
    }

    return (
        <>
            <button 
                aria-label={`${teamName} à été ajouté aux favoris`} 
                onClick={handleClick} 
                className={`text-xl ${isFavorite ? 'text-orange-400' : 'text-gray-400'} cursor-pointer`}
            >
                {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
            </button>
        </>
    )
}