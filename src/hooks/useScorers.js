import { useState, useEffect } from "react";

// export const useScorers = (competitionId) => {
//     const [scorers, setScorers] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if(!competitionId) return;

//         const fetchScorers = async () => {
//             try {
//                 const response = await fetch(`${import.meta.env.VITE_API_URL}/scorers/${competitionId}`);
//                 if(!response.ok){
//                     throw new Error('Erreur API buteurs');
//                 }

//                 const data = await response.json();
//                 setScorers(data)
//             } catch(e){
//                 console.error('useScorers :', e.message);
//                 setError(e.message)
//             }
//         }
//     fetchScorers();
//     }, [competitionId]);

//     return { scorers, error}
// }

export const useScorers = (competitionId) => {
  const [scorers, setScorers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!competitionId) return;

    const fetchAllPages = async () => {
      try {
        let page = 1;
        let allScorers = [];
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/scorers/${competitionId}?page=${page}`
          );

          if (!response.ok) {
            throw new Error("Erreur API buteurs");
          }

          const result = await response.json();
          console.log('result ', result)

          // Ajout des données de la page
          allScorers = [...allScorers, ...(result || [])];

          // Gestion pagination
          const pagination = result.pagination;
          hasMore = pagination?.has_more || false;
          page = pagination?.next_page || null;
        }
        console.log('all scorers', allScorers)
        setScorers(allScorers);

      } catch (e) {
        console.error("useScorers :", e.message);
        setError(e.message);
      }
    };

    fetchAllPages();
  }, [competitionId]);

  return { scorers, error };
};