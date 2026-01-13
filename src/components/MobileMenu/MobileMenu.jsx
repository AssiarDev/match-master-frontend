import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

export const MobileMenu = ({ onClose }) => {
    const { isAuthenticated, user } = useAuth()
    const logout = useLogout()

    return (
        <div className="fixed top-20 right-0 h-full w-64 bg-zinc-900/40 backdrop-blur-md shadow-lg z-50 px-6 py-4 flex flex-col gap transition-transform duration-300">
            <Link to="/live" className="text-white" onClick={onClose}>Live</Link>
            <Link to="/competitions" className="text-white" onClick={onClose}>Compétitions</Link>
            <Link to="favoris" className="text-white" onClick={onClose}>Favoris</Link>

            {isAuthenticated ? (
                <>
                    <span className="flex items-center gap-2 text-orange-400">
                        <FiUser /> {user?.username}
                    </span>

                    <button
                        onClick={() => {
                            logout()
                            onClose()
                        }}
                        className="text-left text-red-400"
                    >
                        Déconnexion
                    </button>
                </>
            ) : (
                <Link to="/login" className="text-white" onClick={onClose}>Se connecter</Link>
            )
            }
        </div>
    )
}