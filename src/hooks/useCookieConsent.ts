import { useState, useEffect } from 'react'
import { hasConsented, setConsent } from '../utils/consent'

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!hasConsented()) setShowBanner(true)
  }, [])

  const accept = () => {
    setConsent('accepted')
    setShowBanner(false)
  }

  const refuse = () => {
    setConsent('refused')
    setShowBanner(false)
  }

  return { showBanner, accept, refuse }
}
