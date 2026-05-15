import { MatchStateDeveloperName } from "@/types"

export const STATE_LABELS: Partial<Record<MatchStateDeveloperName, string>> = {
  INPLAY_1ST_HALF: '1ère mi-temps',
  HT: 'Mi-temps',
  INPLAY_2ND_HALF: '2ème mi-temps',
  INPLAY_ET: 'Prolongations',
  EXTRA_TIME_BREAK: 'Pause prolongations',
  INPLAY_PENALTIES: 'Tirs au but',
  PEN_BREAK: 'Pause tirs au but',
}

export const INPLAY_STATES = new Set<string>([
  MatchStateDeveloperName.INPLAY_FIRST_HALF,
  MatchStateDeveloperName.HALF_TIME,
  MatchStateDeveloperName.INPLAY_SECOND_HALF,
  MatchStateDeveloperName.INPLAY_EXTRA_TIME,
  MatchStateDeveloperName.EXTRA_TIME_BREAK,
  MatchStateDeveloperName.INPLAY_PENALTIES,
  MatchStateDeveloperName.PENALTIES_BREAK,
])