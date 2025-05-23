import { useEffect, useState } from "react";
import { ClassementTbody } from "../Classement/ClassementTbody";
import { ClassmentThead } from "../Classement/ClassementThead";
import { useLocation } from "react-router";

export const Classement = () => {

    const location = useLocation();
    const competitionId = location.state?.competition.id;
    const [standings, setStandings] = useState([]);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/standings/${competitionId}`);
                if(!response.ok){
                    throw new Error('Impossible d\'accéder à la response')
                }
                const result = await response.json();
                console.log('result :', result)
                setStandings(result)
            }catch (e){
                console.error('Error fetching data :', e.message);
            }
        }
        fetchStandings();
    }, [competitionId])
    return (
        <div className="flex justify-center items-center">
            <table>
                <ClassmentThead />
                {standings.map(item => <ClassementTbody key={item.position} item={item}/>)}
            </table>
        </div>
       
    )
}