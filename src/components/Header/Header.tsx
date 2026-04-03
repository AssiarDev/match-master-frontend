import { Link } from 'react-router-dom'
import { Navbar } from '../Forms/Navbar'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { MobileMenu } from '../MobileMenu/MobileMenu'
import { SearchBar } from '../Forms/Searchbar'

interface HeaderProps {
  isMobileMenu: boolean
  setIsMobileMenu: (value: boolean) => void
}

export const Header = ({ isMobileMenu, setIsMobileMenu }: HeaderProps) => {
  return (
    <header className="h-20 w-full sticky top-0 z-50 shadow-lg shadow-amber-900/50">
      <div className="w-full mx-auto flex items-center justify-between h-full px-4">
        <Link to="/" className="text-3xl font-bold text-white">
          Match Master
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <Navbar />
        </div>

        <BurgerMenu
          isOpen={isMobileMenu}
          onToggle={() => setIsMobileMenu(!isMobileMenu)}
        />

        <div className="hidden md:block ml-4">
          <SearchBar />
        </div>
      </div>

      {isMobileMenu && (
        <MobileMenu onClose={() => setIsMobileMenu(false)} />
      )}
    </header>
  )
}