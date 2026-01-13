import { Link } from "react-router-dom";
import { Navbar } from "../Forms/Navbar";
import { BurgerMenu } from "../BurgerMenu/BurgerMenu";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { SearchBar } from "../Forms/Searchbar";

export const Header = ({ isMobileMenu, setIsMobileMenu }) => {
  return (
    <header className="h-20 w-full sticky top-0 z-50 shadow-lg shadow-amber-900/50">
      <div className="w-full mx-auto flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-white">
          Match Master
        </Link>

        {/* Navbar desktop centrée */}
        <div className="hidden md:flex flex-1 justify-center">
          <Navbar />
        </div>

        {/* Burger mobile à droite */}
        <BurgerMenu
          isOpen={isMobileMenu}
          onToggle={() => setIsMobileMenu(!isMobileMenu)}
        />

        {/* SearchBar desktop */}
        <div className="hidden md:block ml-4">
          <SearchBar />
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenu && (
        <MobileMenu onClose={() => setIsMobileMenu(false)} />
      )}
    </header>
  );
};