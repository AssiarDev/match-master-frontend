import { SelectorLeague } from "../Selector/LeagueSelector";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export const Home = () => {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/protected-route`, {
                    credentials: "include", 
                });
                const data = await response.json();
                console.log('data auth :', data)

                if (data.redirect) {
                    navigate("/login");
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Erreur d'authentification :", error);
                navigate("/login"); 
            }
        };

        checkAuth();
    }, [navigate]);

    if (isAuthenticated === null) return <p>Chargement...</p>;

    return (
        <>
            {<div className="w-full h-screen flex flex-col justify-center items-center overflow-hidden">
            <div className="w-150 h-80 bg-stone-950 border border-stone-800 shadow-xl rounded-lg flex flex-col justify-center items-center gap-2">
            <div className="w-full flex justify-center text-white text-3xl font-medium">
                    <h2>Choissisez votre équipe favorite</h2>
            </div>
            <div className="flex flex-col w-full justify-center items-center gap-2">
                <label htmlFor="league-selector" className="text-white text-xl">Choisissez le championnat :</label>
                <SelectorLeague />
            </div>
            </div>
            </div> }
        </>
    )
}