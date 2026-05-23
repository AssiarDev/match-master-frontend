const CONSENT_KEY = "cookie_consent";

export const hasConsented = (): boolean =>
  localStorage.getItem(CONSENT_KEY) !== null;

export const setConsent = (value: "accepted" | "refused"): void =>
  localStorage.setItem(CONSENT_KEY, value);
