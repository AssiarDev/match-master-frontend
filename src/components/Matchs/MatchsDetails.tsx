import { useEffect, useState } from 'react'
import { DatePickerCarousel } from '../DatePicker/DatePickerCaroussel'
import { CompetitionGroup } from '../Competitions/CompetitionGroup'
import { useMatchByDate } from '../../hooks/useMatchByDate'
import { useLocation } from 'react-router'
import { Toast } from '../Toast/Toast'

export const MatchsDetails = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { matchesByDate, error } = useMatchByDate(selectedDate)
  const location = useLocation()
  const message = location.state?.message
  const [showToast, setShowToast] = useState(!!message)

  useEffect(() => {
    if (!message) return
    window.history.replaceState({}, '')
    const timer = setTimeout(() => setShowToast(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const formattedDate = selectedDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
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
            </a>{' '}
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
    {message && <Toast message={message} show={showToast} />}
    </>
  )
}