import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface DatePickerCarouselProps {
  selectedDate: Date | null
  onDateChange: (date: Date) => void
}

interface ArrowButtonProps {
  onClick?: () => void
}

const PrevButton = ({ onClick }: ArrowButtonProps) => (
  <button
    type="button"
    className="absolute left-[-40px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
    onClick={onClick}
  >
    ←
  </button>
)

const NextButton = ({ onClick }: ArrowButtonProps) => (
  <button
    type="button"
    className="absolute right-[-40px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
    onClick={onClick}
  >
    →
  </button>
)

/**
 * Horizontal carousel showing a 30-day window centered on today.
 * Highlights the selected date and calls `onDateChange` on click.
 * Arrows are hidden on mobile — swipe gesture is used instead.
 */
export const DatePickerCarousel = ({ selectedDate, onDateChange }: DatePickerCarouselProps) => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = new Date()
    day.setDate(day.getDate() + (i - 15))
    return day
  })
  const today = new Date()

  const todayIndex = days.findIndex(day => day.toDateString() === today.toDateString())

  const settings = {
    initialSlide: todayIndex,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
    ],
  }

  return (
    <div className="w-full relative px-2 sm:px-10">
      <Slider {...settings}>
        {days.map((day) => {
          const isToday = day.toDateString() === today.toDateString()
          return (
            <div
              key={day.toISOString()}
              className={`py-0.5 text-center rounded-md mx-0.5 sm:mx-1 cursor-pointer ${
                selectedDate?.toDateString() === day.toDateString()
                  ? 'bg-orange-800 text-white font-bold'
                  : 'text-white'
              }`}
              onClick={() => onDateChange(day)}
            >
              <p className="text-xs leading-tight">{isToday ? "Auj." : day.getDate()}</p>
              <p className="text-xs leading-tight">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
