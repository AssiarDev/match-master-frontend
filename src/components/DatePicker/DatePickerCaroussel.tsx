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
    className="absolute left-[-50px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
    onClick={onClick}
  >
    ←
  </button>
)

const NextButton = ({ onClick }: ArrowButtonProps) => (
  <button
    type="button"
    className="absolute right-[-50px] top-[1%] text-white hover:bg-gray-800 rounded-sm px-2 py-2 cursor-pointer"
    onClick={onClick}
  >
    →
  </button>
)

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
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />,
  }

  return (
    <div className="w-100 relative">
      <Slider {...settings}>
        {days.map((day) => {
          const isToday = day.toDateString() === today.toDateString()
          return (
            <div
              key={day.toISOString()}
              className={`py-1 text-center rounded-md shadow-lg mx-2 cursor-pointer ${
                selectedDate?.toDateString() === day.toDateString()
                  ? 'bg-orange-800 text-white font-bold'
                  : 'text-white'
              }`}
              onClick={() => onDateChange(day)}
            >
              <p className="text-xs">{isToday ? "Aujourd'hui" : day.getDate()}</p>
              <p className="text-xs">{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</p>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}