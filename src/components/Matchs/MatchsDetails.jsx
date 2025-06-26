// import { useState } from "react";
// import { DatePickerCarousel } from "../DatePicker/DatePickerCaroussel";
// import { CompetitionGroup } from "../Competitions/CompetitionGroup";
// import { useMatchByDate } from "../../hooks/useMatchByDate";

// export const MatchsDetails = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const { matchesByDate, error } = useMatchByDate(selectedDate);

//   const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div className="flex flex-col gap-5 mx-2">
//       {error ? (
//         <p className="text-red-500">Une erreur s'est produite : {error}</p>
//       ) : (
//         <>
//           <p className="text-gray-600">
//             <a href="/" className="text-white underline">
//               Match Master
//             </a>{" "}
//             / Score du {formattedDate}
//           </p>

//           <div className="w-full flex flex-col mx-auto gap-5">
//             <div className="flex justify-center mb-5">
//               <DatePickerCarousel
//                 selectedDate={selectedDate}
//                 onDateChange={setSelectedDate}
//               />
//             </div>

//             {Object.keys(matchesByDate).length > 0 ? (
//               Object.entries(matchesByDate).map(([name, data]) => (
//                 <CompetitionGroup
//                   key={name}
//                   name={name}
//                   flag={data.flag}
//                   matches={data.matches}
//                 />
//               ))
//             ) : (
//               <p className="text-gray-400 text-center mt-6">
//                 Aucun match disponible pour cette date.
//               </p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

import { useState } from "react";
import { DatePickerCarousel } from "../DatePicker/DatePickerCaroussel";
import { CompetitionGroup } from "../Competitions/CompetitionGroup";
import { useMatchByDate } from "../../hooks/useMatchByDate";

export const MatchsDetails = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { matchesByDate, error } = useMatchByDate(selectedDate);

  const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-8">
      {error ? (
        <p className="text-red-500 text-center">
          Une erreur s'est produite : {error}
        </p>
      ) : (
        <>
          <p className="w-full text-gray-400 text-sm sm:text-base text-left">
            <a href="/" className="text-white underline hover:text-amber-500 transition">
              Match Master
            </a>{" "}
            / Score du {formattedDate}
          </p>

          <div className="flex justify-center">
            <DatePickerCarousel
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {Object.keys(matchesByDate).length > 0 ? (
            Object.entries(matchesByDate).map(([name, data]) => (
              <CompetitionGroup
                key={name}
                name={name}
                flag={data.flag}
                matches={data.matches}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center mt-6 text-lg">
              Aucun match disponible pour cette date.
            </p>
          )}
        </>
      )}
    </div>
  );
};