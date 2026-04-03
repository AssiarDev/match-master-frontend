import { FiMenu, FiX } from 'react-icons/fi'

interface BurgerMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export const BurgerMenu = ({ isOpen, onToggle }: BurgerMenuProps) => {
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
