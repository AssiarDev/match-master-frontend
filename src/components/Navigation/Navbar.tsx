import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

/** Desktop navigation bar with links to Live, Competitions, and user account menu (profile, favorites, logout). */
export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useLogout();

  return (
    <nav className="text-zinc-100 px-4 py-3 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <ul className="flex gap-6 text-xl items-center">
          <li>
            <Link to="/live" className="hover:underline">
              Live
            </Link>
          </li>
          <li>
            <Link to="/competitions" className="hover:underline">
              Compétitions
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 px-3 py-1 rounded-md cursor-pointer"
              >
                <FiUser className="text-zinc-100" />
                {user?.username}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-zinc-800 rounded-md text-sm shadow-lg z-10">
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 hover:bg-zinc-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Link
                    to="/favoriteUser"
                    className="block px-4 py-2 hover:bg-zinc-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes favoris
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:underline">
                Se connecter
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
