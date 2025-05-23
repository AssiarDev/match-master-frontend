import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlArrowDown } from "react-icons/sl"

export const Navbar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(data.isAuthenticated);
                    setUsername(data.user.username)
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Erreur d'authentification :", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

        const handleLogout = async () => {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: "POST",
            credentials: "include", 
        });

        if (!response.ok) throw new Error("Erreur lors de la déconnexion");

        setIsAuthenticated(false);
        setTimeout(() => {
            window.location.href = "/login";
        }, 300);

        } catch (error) {
            console.error("Échec de la déconnexion :", error);
        }
    }
    
    return (
    <nav >
        <ul className="flex justify-center items-center gap-10 text-white text-2xl">
            <li>
                <Link to="/live">Live</Link>
            </li>
            <li>
                <Link to="/competitions">Compétitions</Link>
            </li>
            <li>
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            className="flex justify-center items-center gap-4 border border-red-500 bg-orange-700 hover:bg-orange-600 text-white px-2 py-1 rounded-md cursor-pointer"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {username} <SlArrowDown />
                        </button>
                          {isMenuOpen && (
                                <div className="absolute right-0 bg-gray-800 text-white rounded-md mt-2 p-2 flex flex-col">
                                    <Link to="/favoris" className="py-1 px-2 hover:bg-gray-700">Favoris</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="py-1 px-2 hover:bg-gray-700 text-left"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                            </div>
                    ) : (
                        <Link to="/login">Se connecter</Link>
                    )}
            </li>
            <li>
                <Link to="favoris">Favoris</Link>
            </li>
        </ul>
    </nav>
    )
}