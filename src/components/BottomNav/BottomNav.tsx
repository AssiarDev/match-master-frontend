import { useLocation, useNavigate } from "react-router-dom";
import { FiStar, FiSearch } from "react-icons/fi";
import { useLiveStreamContext } from "@/context/LiveStreamContext";

interface BottomNavProps {
  onSearchToggle: () => void;
  isSearchOpen: boolean;
}

/** Fixed bottom navigation bar for mobile screens. */
export const BottomNav = ({ onSearchToggle, isSearchOpen }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasLiveMatches } = useLiveStreamContext();

  const isActive = (path: string) => location.pathname === path;

  const handleTabClick = (path: string) => {
    if (isActive(path)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  const baseTab =
    "flex flex-col items-center justify-center gap-1 text-xs font-medium w-16 h-11 rounded-lg border transition-colors cursor-pointer";

  const activeClass = "text-amber-600 border-amber-600";
  const inactiveClass = "text-zinc-400 border-zinc-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-900 border-t border-zinc-700">
      <div className="flex justify-around items-center h-16 px-2">
        <button
          onClick={() => handleTabClick("/")}
          className={`${baseTab} ${isActive("/") ? activeClass : inactiveClass}`}
        >
          <span>Matchs</span>
        </button>

        <button
          onClick={() => handleTabClick("/favoriteUser")}
          className={`${baseTab} ${isActive("/favoriteUser") ? activeClass : inactiveClass}`}
        >
          <FiStar size={18} />
          <span>Favoris</span>
        </button>

        <button
          onClick={() => handleTabClick("/live")}
          className={`${baseTab} relative ${
            isActive("/live") ? "text-red-400 border-red-400" : inactiveClass
          }`}
        >
          <span>Live</span>
          {hasLiveMatches && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        <button
          onClick={onSearchToggle}
          aria-label="Recherche"
          className={`${baseTab} ${isSearchOpen ? activeClass : inactiveClass}`}
        >
          <FiSearch size={18} />
        </button>
      </div>
    </nav>
  );
};
