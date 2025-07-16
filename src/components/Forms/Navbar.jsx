import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  const logout = useLogout();

  const toggleMobileMenu = () => setIsMobileMenu(!isMobileMenu);

  return (
    <nav className="text-white px-4 py-3 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Mobile burger icon */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {isMobileMenu ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 text-xl items-center">
          <li>
            <Link to="/live" className="hover:underline">Live</Link>
          </li>
          <li>
            <Link to="/competitions" className="hover:underline">Compétitions</Link>
          </li>
          <li>
            <Link to="/favoris" className="hover:underline">Favoris</Link>
          </li>
          {isAuthenticated ? (
            <li className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-orange-700 hover:bg-orange-600 px-3 py-1 rounded-md cursor-pointer"
              >
                <FiUser className="text-white" />
                {user?.username}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded-md text-sm shadow-lg z-10">
                  <Link
                    to="/favoriteUser"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favoris
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:underline">Se connecter</Link>
            </li>
          )}
        </ul>
      </div>

    {/* Mobile menu */}
    {isMobileMenu && (
    <div className="fixed top-20 right-0 h-full w-64 bg-zinc-900/40 backdrop-blur-md shadow-lg z-50 px-6 py-4 flex flex-col gap-4 transition-transform duration-300">
        <Link to="/live" onClick={toggleMobileMenu}>Live</Link>
        <Link to="/competitions" onClick={toggleMobileMenu}>Compétitions</Link>
        <Link to="/favoris" onClick={toggleMobileMenu}>Favoris</Link>

        {isAuthenticated ? (
        <>
            <span className="flex items-center gap-2 text-orange-400">
            <FiUser /> {user?.username}
            </span>
            <button onClick={logout} className="text-left text-red-400">
            Déconnexion
            </button>
        </>
        ) : (
        <Link to="/login" onClick={toggleMobileMenu}>Se connecter</Link>
        )}
  </div>
    )}
    </nav>
  );
};