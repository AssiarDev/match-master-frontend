import { FiMenu, FiX } from "react-icons/fi";

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

/** Toggle button for the mobile navigation menu (hamburger / close icon). */
export const BurgerMenu = ({ isOpen, onToggle }: BurgerMenuProps) => {
  return (
    <button
      className="md:hidden text-3xl text-white"
      onClick={onToggle}
      aria-label="Menu"
    >
      {isOpen ? <FiX /> : <FiMenu />}
    </button>
  );
};
