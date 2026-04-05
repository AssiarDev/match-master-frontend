import { Transition } from '@headlessui/react'

type ToastProps = {
  message: string
  show: boolean
}

export const Toast = ({ message, show }: ToastProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Transition
        show={show}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="bg-zinc-900 border border-red-500 text-white px-5 py-3 rounded-xl shadow-lg">
          {message}
        </div>
      </Transition>
    </div>
  )
}
