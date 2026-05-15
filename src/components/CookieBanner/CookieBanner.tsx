import { Transition } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { useCookieConsent } from '../../hooks/useCookieConsent'

export const CookieBanner = () => {
  const { showBanner, accept, refuse } = useCookieConsent()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <Transition
        show={showBanner}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="pointer-events-auto bg-zinc-900 border-t border-amber-900/50 shadow-lg shadow-amber-900/30 px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-sm text-gray-300 leading-relaxed">
              Nous utilisons un cookie de session strictement nécessaire à votre connexion. Aucun
              cookie de suivi n'est utilisé.{' '}
              <Link to="/privacy" className="text-amber-400 hover:underline">
                En savoir plus
              </Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={refuse}
                className="text-sm px-4 py-2 border border-gray-600 text-gray-300 rounded hover:border-gray-400 hover:text-white transition duration-200 cursor-pointer"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="text-sm px-4 py-2 bg-amber-600 text-zinc-950 font-semibold rounded hover:bg-amber-500 transition duration-200 cursor-pointer"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}
