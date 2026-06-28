import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useLiveStream } from "@/hooks/useLiveStream";
import { INPLAY_STATES } from "@/utils/constants";
import type { LiveMatch } from "@/types";

interface LiveStreamContextValue {
  matches: LiveMatch[];
  connected: boolean;
  error: string | null;
  hasLiveMatches: boolean;
}

const LiveStreamContext = createContext<LiveStreamContextValue | null>(null);

/** Provides a single SSE connection shared across the app. */
export const LiveStreamProvider = ({ children }: { children: ReactNode }) => {
  const { matches, connected, error } = useLiveStream();

  const hasLiveMatches = useMemo(
    () =>
      matches.some(
        (m) =>
          m.state?.developer_name && INPLAY_STATES.has(m.state.developer_name),
      ),
    [matches],
  );

  return (
    <LiveStreamContext.Provider
      value={{ matches, connected, error, hasLiveMatches }}
    >
      {children}
    </LiveStreamContext.Provider>
  );
};

/** @throws if used outside LiveStreamProvider */
export const useLiveStreamContext = (): LiveStreamContextValue => {
  const ctx = useContext(LiveStreamContext);
  if (!ctx)
    throw new Error(
      "useLiveStreamContext must be used inside LiveStreamProvider",
    );
  return ctx;
};
