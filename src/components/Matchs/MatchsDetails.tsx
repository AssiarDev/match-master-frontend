import { useEffect, useState, useMemo } from "react";
import { DatePickerCarousel } from "../DatePicker/DatePickerCaroussel";
import { CompetitionGroup } from "../Competitions/CompetitionGroup";
import { useMatchByDate } from "../../hooks/useMatchByDate";
import { useLiveStream } from "../../hooks/useLiveStream";
import { useLocation } from "react-router";
import { Toast } from "../Toast/Toast";
import { INPLAY_STATES } from "@/utils/constants";

/** Home page: date picker carousel + matches grouped by competition for the selected date.
 * Live matches are automatically rendered as LiveMatchCard via the SSE stream.
 * Shows a toast on redirect messages.
 */
export const MatchsDetails = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { matchesByDate, error } = useMatchByDate(selectedDate);
  const { matches: liveMatches } = useLiveStream();

  const liveMap = useMemo(
    () =>
      new Map(
        liveMatches
          .filter(
            (m) =>
              m.state?.developer_name &&
              INPLAY_STATES.has(m.state.developer_name),
          )
          .map((m) => [m.id, m]),
      ),
    [liveMatches],
  );
  const location = useLocation();
  const message = location.state?.message;
  const [showToast, setShowToast] = useState(!!message);

  useEffect(() => {
    if (!message) return;
    window.history.replaceState({}, "");
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Paris",
  });

  return (
    <>
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 sm:gap-6 py-6 sm:py-8 px-3 sm:px-4">
        {error ? (
          <p className="text-red-500 text-center">
            Une erreur s'est produite : {error}
          </p>
        ) : (
          <>
            <p className="w-full text-gray-400 text-sm sm:text-base text-left">
              <a
                href="/"
                className="text-white underline hover:text-amber-500 transition"
              >
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
                  leagueId={data.leagueId}
                  liveMap={liveMap}
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
      {message && <Toast message={message} show={showToast} />}
    </>
  );
};
