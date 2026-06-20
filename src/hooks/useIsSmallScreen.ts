import { useEffect, useState } from "react";

/** Returns true when the viewport is narrower than Tailwind's `sm` breakpoint (640 px). */
export const useIsSmallScreen = (): boolean => {
  const [isSmall, setIsSmall] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 640,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsSmall(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isSmall;
};
