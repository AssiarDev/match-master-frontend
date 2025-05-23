import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const DatePickerCarousel = ({ selectedDate, onDateChange }) => {
    // Générer 15 jours avant et 15 jours après aujourd'hui
    const days = Array.from({ length: 30 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + (i - 15)); // -15 pour les jours précédents, +15 pour les jours suivants
        return day;
    });
    const today = new Date();

    // Trouver l'index de la date "aujourd'hui"
    const todayIndex = days.findIndex(day => day.toDateString() === today.toDateString());

    // Bouton précédent
    const PrevButton = ({ onClick }) => (
        <button
            type="button" // Ajout du type pour éviter des comportements inattendus
            className="absolute left-[-50px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
            onClick={onClick} // Transmet seulement les props nécessaires
        >
            ←
        </button>
    );

    // Bouton suivant
    const NextButton = ({ onClick }) => (
        <button
            type="button" // Ajout du type pour éviter des comportements inattendus
            className="absolute right-[-50px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
            onClick={onClick} // Transmet seulement les props nécessaires
        >
            →
        </button>
    );

    // Paramètres pour le slider
    const settings = {
        initialSlide: todayIndex,
        infinite: true,
        slidesToShow: 3, // Affiche 3 éléments à la fois
        slidesToScroll: 1, // Défile un élément à la fois
        centerMode: true, // Centre l'élément actif
        focusOnSelect: true, // Permet la sélection en cliquant
        prevArrow: <PrevButton />, // Bouton précédent personnalisé
        nextArrow: <NextButton />, // Bouton suivant personnalisé
    };

    return (
        <div className="w-100 relative">
            <Slider {...settings}>
                {days.map((day) => {
                    const isToday = day.toDateString() === today.toDateString();
                    return (
                        <div
                            key={day.toISOString()} // Utilise une clé unique
                            className={`py-1 text-center rounded-md shadow-lg mx-2 cursor-pointer ${
                                selectedDate?.toDateString() === day.toDateString()
                                    ? 'bg-orange-800 text-white font-bold' // Style si la date est sélectionnée
                                    : 'text-white' // Style par défaut
                            }`}
                            onClick={() => onDateChange(day)} // Met à jour la date sélectionnée
                        >
                            <p className="text-xs">{isToday ? "Aujourd'hui" : day.getDate()}</p>
                            <p className="text-xs">{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</p>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};
