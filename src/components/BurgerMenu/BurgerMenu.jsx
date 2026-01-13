import { FiMenu, FiX } from "react-icons/fi";

export const BurgerMenu = ({isOpen, onToggle}) => {
    return (
        <button
            className="md:hidden text-3xl text-white"
            onClick={onToggle}
            aria-label="Menu"
        >
            {isOpen ? <FiX /> : <FiMenu />}
        </button>
    )
}