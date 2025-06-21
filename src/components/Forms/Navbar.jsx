// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { SlArrowDown } from "react-icons/sl"

// export const Navbar = () => {

//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [username, setUsername] = useState('');
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     setIsAuthenticated(data.isAuthenticated);
//                     setUsername(data.user.username)
//                 } else {
//                     setIsAuthenticated(false);
//                 }
//             } catch (error) {
//                 console.error("Erreur d'authentification :", error);
//                 setIsAuthenticated(false);
//             }
//         };

//         checkAuth();
//     }, []);

//         const handleLogout = async () => {
//         try {
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
//             method: "POST",
//             credentials: "include", 
//         });

//         if (!response.ok) throw new Error("Erreur lors de la déconnexion");

//         setIsAuthenticated(false);
//         setTimeout(() => {
//             navigate('/login')
//             // window.location.href = "/login";
//         }, 300);

//         } catch (error) {
//             console.error("Échec de la déconnexion :", error);
//         }
//     }
    
//     return (
//     <nav >
//         <ul className="flex justify-center items-center gap-10 text-white text-2xl">
//             <li>
//                 <Link to="/live">Live</Link>
//             </li>
//             <li>
//                 <Link to="/competitions">Compétitions</Link>
//             </li>
//             <li>
//                 {isAuthenticated ? (
//                     <div className="relative">
//                         <button
//                             className="flex justify-center items-center gap-4 border border-red-500 bg-orange-700 hover:bg-orange-600 text-white px-2 py-1 rounded-md cursor-pointer"
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                         >
//                             {username} <SlArrowDown />
//                         </button>
//                           {isMenuOpen && (
//                                 <div className="absolute right-0 bg-gray-800 text-white rounded-md mt-2 p-2 flex flex-col">
//                                     <Link to="/favoris" className="py-1 px-2 hover:bg-gray-700">Favoris</Link>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="py-1 px-2 hover:bg-gray-700 text-left"
//                                     >
//                                         Déconnexion
//                                     </button>
//                                 </div>
//                             )}
//                             </div>
//                     ) : (
//                         <Link to="/login">Se connecter</Link>
//                     )}
//             </li>
//             <li>
//                 <Link to="favoris">Favoris</Link>
//             </li>
//         </ul>
//     </nav>
//     )
// }


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
                className="flex items-center gap-2 bg-orange-700 hover:bg-orange-600 px-3 py-1 rounded-md"
              >
                <FiUser className="text-white" />
                {user?.username}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded-md text-sm shadow-lg z-10">
                  <Link
                    to="/favoris"
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