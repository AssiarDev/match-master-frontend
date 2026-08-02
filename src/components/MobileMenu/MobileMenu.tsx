import { Link } from "react-router-dom";
import {
  FiUser,
  FiRadio,
  FiAward,
  FiStar,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Slide-in mobile navigation menu with links and auth-aware user actions. */
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-20 right-0 h-full w-64 bg-zinc-900/10 backdrop-blur-xl shadow-lg z-50 px-6 py-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          to="/live"
          className="flex items-center gap-3 text-zinc-100"
          onClick={onClose}
        >
          <FiRadio /> Score en Live
        </Link>
        <Link
          to="/competitions"
          className="flex items-center gap-3 text-zinc-100"
          onClick={onClose}
        >
          <FiAward /> Compétitions
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/favoriteUser"
              className="flex items-center gap-3 text-zinc-100"
              onClick={onClose}
            >
              <FiStar /> Favoris
            </Link>
            <Link
              to="/user-profile"
              className="flex items-center gap-3 text-amber-600"
              onClick={onClose}
            >
              <FiUser /> {user?.username}
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-3 text-left text-red-400"
            >
              <FiLogOut /> Déconnexion
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 text-zinc-100"
            onClick={onClose}
          >
            <FiLogIn /> Se connecter
          </Link>
        )}
      </div>
    </>
  );
};
