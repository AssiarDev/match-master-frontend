import { useState, useEffect, useRef } from "react";
import type { LiveMatch } from "@/types";

interface UseLiveStreamResult {
  matches: LiveMatch[];
  connected: boolean;
  error: string | null;
}

/**
 * Opens a persistent SSE connection to /matches/live/stream.
 * No authentication required for this endpoint
 * The EventSource is automatically closed on unmount
 *
 * Uses VITE_SSE_URL instead of VITE_API_URL: in production the rest of the API
 * goes through the Netlify proxy redirect to keep the auth cookie SameSite=Strict,
 * but that proxy does not relay SSE streams — it forwards the first chunk then
 * closes the connection. This endpoint is public, so it can hit the backend
 * directly without the proxy and without the cookie.
 *
 * returns `{matches, connected, error }`
 */

export const useLiveStream = (): UseLiveStreamResult => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_SSE_URL}/matches/live/stream`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
    };

    es.onmessage = (event: MessageEvent) => {
      try {
        const data: LiveMatch[] = JSON.parse(event.data);
        setMatches(data);
      } catch {
        setError("Format de données attendu");
      }
    };

    es.onerror = () => {
      setConnected(false);
      setError("Connexion au flux en direct perdue");
      /**The browser handles reconnection automatically — do not close*/
    };

    return () => {
      es.close();
      esRef.current = null;
      setConnected(false);
    };
  }, []);

  return { matches, connected, error };
};
