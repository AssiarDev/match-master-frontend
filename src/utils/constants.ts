import { MatchStateDeveloperName } from "@/types";

export const ROUND_LABELS: Record<string, string> = {
  // Phases finales
  "round of 128": "64e de finale",
  "round of 64": "32e de finale",
  "round of 32": "16e de finale",
  "round of 16": "8e de finale",
  "eighth-finals": "8e de finale",
  "quarter-finals": "Quarts de finale",
  quarterfinals: "Quarts de finale",
  "quarter-final replays": "Replays des quarts de finale",
  "semi-finals": "Demi-finales",
  semifinals: "Demi-finales",
  "semi-final replays": "Replays des demi-finales",
  final: "Finale",

  // Tours numérotés (FA Cup, EFL Cup…)
  "extra preliminary round": "Tour extra préliminaire",
  "extra preliminary round replays": "Replays du tour extra préliminaire",
  "preliminary round": "Tour préliminaire",
  "preliminary round replays": "Replays du tour préliminaire",
  "1st round": "1er tour",
  "first round": "1er tour",
  "1st round replays": "Replays du 1er tour",
  "first round replays": "Replays du 1er tour",
  "2nd round": "2ème tour",
  "second round": "2ème tour",
  "2nd round replays": "Replays du 2ème tour",
  "second round replays": "Replays du 2ème tour",
  "3rd round": "3ème tour",
  "third round": "3ème tour",
  "3rd round replays": "Replays du 3ème tour",
  "third round replays": "Replays du 3ème tour",
  "4th round": "4ème tour",
  "fourth round": "4ème tour",
  "4th round replays": "Replays du 4ème tour",
  "fourth round replays": "Replays du 4ème tour",
  "5th round": "5ème tour",
  "fifth round": "5ème tour",
  "5th round replays": "Replays du 5ème tour",
  "fifth round replays": "Replays du 5ème tour",

  // Tours de qualification (FA Cup, compétitions européennes…)
  "qualifying round": "Tour de qualification",
  "1st round qualifying": "1er tour de qualification",
  "2nd round qualifying": "2ème tour de qualification",
  "3rd round qualifying": "3ème tour de qualification",
  "4th round qualifying": "4ème tour de qualification",
  "1st round qualifying replays": "Replays du 1er tour de qualification",
  "2nd round qualifying replays": "Replays du 2ème tour de qualification",
  "3rd round qualifying replays": "Replays du 3ème tour de qualification",
  "4th round qualifying replays": "Replays du 4ème tour de qualification",
  "1st qualifying round": "1er tour de qualification",
  "2nd qualifying round": "2ème tour de qualification",
  "3rd qualifying round": "3ème tour de qualification",
  "4th qualifying round": "4ème tour de qualification",
  "play-off round": "Tour des barrages",
  "play-offs": "Barrages",
  "knockout round play-offs": "Barrages",

  // Phases de groupe
  "group stage": "Phase de groupes",
  "league phase": "Phase de ligue",
};

/**
 * Maps a number of matches in a round to its French phase label.
 * Used as a fallback when the API round name is not in ROUND_LABELS
 * (e.g. SportMonks ordinal names like "5th Round").
 */
const MATCH_COUNT_LABELS: Record<number, string> = {
  1: "Finale",
  2: "Demi-finales",
  4: "Quarts de finale",
  8: "Huitième de finale",
  16: "16e de finale",
  32: "32e de finale",
  64: "64e de finale",
};

/**
 * Converts a SportMonks round name to its French label.
 * Falls back to the match count mapping when the name is not recognised,
 * then to the raw API name as a last resort.
 */
export const toFrenchRoundLabel = (name: string, matchCount?: number): string =>
  ROUND_LABELS[name.toLowerCase()] ??
  (matchCount !== undefined ? MATCH_COUNT_LABELS[matchCount] : undefined) ??
  name;

// ── Bracket layout ────────────────────────────────────────────────────────────

/** Fixed height of one match card in the bracket (px). */
export const BRACKET_CARD_H = 64;

/** Width of one match card in the bracket on desktop screens (px — equivalent to w-44). */
export const BRACKET_CARD_W = 176;

/** Width of one match card in the bracket on mobile screens (px). */
export const BRACKET_CARD_W_SM = 140;

/** Base gap between cards in the earliest round (px). Doubles per subsequent round. */
export const BRACKET_BASE_GAP = 8;

/** Height of one bracket slot: one card plus its base gap (px). */
export const BRACKET_UNIT = BRACKET_CARD_H + BRACKET_BASE_GAP;

/** Width of the SVG connector column on desktop screens (px). */
export const BRACKET_CONNECTOR_W = 32;

/** Width of the SVG connector column on mobile screens (px). */
export const BRACKET_CONNECTOR_W_SM = 20;

/**
 * Fixed height reserved for the round label placed at the top of each bracket column (px).
 * All SVG connector y-coordinates are offset by this value so lines align with card centres.
 */
export const BRACKET_LABEL_H = 24;

/**
 * Maximum number of matches in a stage to be shown in the visual bracket schema.
 * Stages with more matches (early rounds) are displayed as a list instead.
 * 8 means the bracket starts at the 8e de finale (Round of 16).
 */
export const BRACKET_MAX_MATCHES = 8;

// ── Match state labels ────────────────────────────────────────────────────────

export const STATE_LABELS: Partial<Record<MatchStateDeveloperName, string>> = {
  INPLAY_1ST_HALF: "1ère mi-temps",
  HT: "Mi-temps",
  INPLAY_2ND_HALF: "2ème mi-temps",
  INPLAY_ET: "Prolongations",
  EXTRA_TIME_BREAK: "Pause prolongations",
  INPLAY_PENALTIES: "Tirs au but",
  PEN_BREAK: "Pause tirs au but",
};

export const INPLAY_STATES = new Set<string>([
  MatchStateDeveloperName.INPLAY_FIRST_HALF,
  MatchStateDeveloperName.HALF_TIME,
  MatchStateDeveloperName.INPLAY_SECOND_HALF,
  MatchStateDeveloperName.INPLAY_EXTRA_TIME,
  MatchStateDeveloperName.EXTRA_TIME_BREAK,
  MatchStateDeveloperName.INPLAY_PENALTIES,
  MatchStateDeveloperName.PENALTIES_BREAK,
]);
