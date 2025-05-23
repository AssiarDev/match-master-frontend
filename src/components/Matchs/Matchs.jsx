import { useEffect, useState } from 'react';
import { DatePickerCarousel } from '../DatePicker/DatePickerCaroussel';
import { MatchCard } from './MatchCard';

export const MatchsDetails = () => {
    const [matchesData, setMatchesData] = useState([]);
    const [filteredData, setFilteredData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date()); // Date sélectionnée par le carousel
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const url = `${import.meta.env.VITE_API_URL}/competitions/matches`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données des matchs.');
                }

                const result = await response.json();

                // Organiser les matchs par compétition
                const groupedByCompetition = result.reduce((acc, match) => {
                    const competitionName = match.competition.name;
                    const competitionFlag = match.area?.flag || ''
                    if (!acc[competitionName]) {
                        acc[competitionName] = {
                            flag: competitionFlag,
                            matches: []
                        }
                    }
                    acc[competitionName].matches.push(match);
                    return acc;
                }, {});

                setMatchesData(groupedByCompetition);
                setFilteredData(groupedByCompetition); // Valeur initiale : aucun filtre
            } catch (error) {
                console.error('Erreur lors de la récupération des détails des matchs :', error.message);
                setError(error.message);
            }
        };

        fetchMatchDetails();
    }, []);

    useEffect(() => {
        if (!selectedDate) {
            setFilteredData(matchesData); // Si aucune date sélectionnée, afficher toutes les données
            return;
        }
    
        // Filtrer les données en fonction de la date sélectionnée
        const filtered = Object.entries(matchesData).reduce((acc, [competitionName, competitionData]) => {
            const filteredMatches = competitionData.matches.filter(match => {
                const matchDate = new Date(match.utcDate);
                return matchDate.toDateString() === selectedDate.toDateString(); // Comparer les dates
            });
    
            if (filteredMatches.length > 0) {
                acc[competitionName] = {...competitionData, matches: filteredMatches}
            }
            return acc;
        }, {});
    
        setFilteredData(filtered);
    }, [selectedDate, matchesData])

    const getCurrentDate = () => {
        const today = selectedDate;
        const option = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        return today.toLocaleDateString('fr-FR', option)
    }

    return (
        <div className="flex flex-col gap-5 mx-2">
            {error ? (
                <p className="text-red-500">Une erreur s'est produite : {error}</p>
            ) : (
                <>  
                    <div>
                        <p className="text-gray-600">
                            <a href="/" className='text-white underline'>Match Master</a> / Score du {getCurrentDate()}
                        </p>
                    </div>
                    {/* Date Picker Carousel */}
                    <div className="flex justify-center mb-5">
                        <DatePickerCarousel
                            selectedDate={selectedDate}
                            onDateChange={(date) => setSelectedDate(date)} // Synchroniser avec le carousel
                        />
                    </div>

                    {/* Affichage des matchs par compétition */}
                    {Object.entries(filteredData).length > 0 ? (
                        Object.entries(filteredData).map(([competitionName, competitionData]) => {
                            const { flag, matches } = competitionData;
                            return (
                            <div key={competitionName} className="mb-8">
                                <div className='flex gap-5 items-center ml-4'>
                                    <h2 className="text-2xl font-bold text-white">{competitionName}</h2>
                                    <img src={flag} alt="" className='h-5'/>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {matches.map((match) => (
                                        <MatchCard key={match.id} item={match} /> // Utilisation de MatchCard
                                    ))}
                                </div>
                            </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-400">Aucun match disponible pour cette date.</p>
                    )}
                </>
            )}
        </div>
    );
};