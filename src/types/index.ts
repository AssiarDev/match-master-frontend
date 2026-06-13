// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  createdAt?: string;
}

// ─── Competitions ────────────────────────────────────────────────────────────

export interface Competition {
  id: number;
  name: string;
  image_path?: string;
  emblem?: string;
}

export interface League {
  name: string;
  code: number;
  logo?: string;
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  image: string;
  shortName?: string;
}

export interface MatchParticipant {
  id: number;
  name: string;
  short_code?: string;
  image_path?: string;
  meta?: {
    location: "home" | "away";
  };
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export interface ScoreDetail {
  score: {
    participant: "home" | "away";
    goals: number;
  };
}

export interface ScoresWrapper {
  data?: ScoreDetail[];
}

export interface Match {
  id: number;
  starting_at: string;
  starting_at_timestamp: number;
  state_id: number;
  participants?: MatchParticipant[];
  scores?: ScoreDetail[] | ScoresWrapper;
}

export interface Round {
  fixtures?: Match[];
}

export interface Stage {
  rounds?: Round[];
  stages?: Stage[];
  fixtures?: Match[];
}

export interface LeagueMatchGroup {
  flag?: string;
  leagueId?: number;
  matches: Match[];
}

export type MatchesByLeague = Record<string, LeagueMatchGroup>;

// ─── Live Matches ──────────────────────────────────────────────────────────────

export enum ScoreDescription {
  CURRENT = "CURRENT",
  FIRST_HALF = "1ST_HALF",
  SECOND_HALF = "2ND_HALF",
  SECOND_HALF_ONLY = "2ND_HALF_ONLY",
  EXTRA_TIME = "EXTRA_TIME",
  EXTRA_TIME_ONLY = "EXTRA_TIME_ONLY",
  PENALTIES = "PENALTIES",
}

export enum MatchStateDeveloperName {
  NOT_STARTED = "NS",
  INPLAY_FIRST_HALF = "INPLAY_1ST_HALF",
  HALF_TIME = "HT",
  INPLAY_SECOND_HALF = "INPLAY_2ND_HALF",
  INPLAY_EXTRA_TIME = "INPLAY_ET",
  EXTRA_TIME_BREAK = "EXTRA_TIME_BREAK",
  INPLAY_PENALTIES = "INPLAY_PENALTIES",
  PENALTIES_BREAK = "PEN_BREAK",
  FULL_TIME = "FT",
  AFTER_EXTRA_TIME = "AET",
  FULL_TIME_PENALTIES = "FT_PEN",
  POSTPONED = "POSTPONED",
  CANCELLED = "CANCELLED",
  ABANDONED = "ABANDONED",
  SUSPENDED = "SUSPENDED",
}

export interface LiveParticipant {
  id: number;
  name: string;
  short_code: string | null;
  image_path: string | null;
  meta: {
    location: "home" | "away";
    winner: boolean;
    position: number | null;
  };
}

export interface LiveScore {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  description: ScoreDescription;
  score: {
    goals: number;
    participant: "home" | "away";
  };
}

export interface LiveMatchState {
  id: number;
  state: string;
  name: string;
  short_name: string;
  developer_name: MatchStateDeveloperName;
}

export interface Period {
  id: number;
  fixture_id: number;
  type_id: number;
  sort_order: number;
  description: string;
  period_length: number;
  counts_from: number;
  has_timer: boolean;
  ticking: boolean;
  minutes: number;
  seconds: number;
  time_added: number;
  started: number | null;
  ended: number | null;
}

export interface LiveMatch {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  group_id: number | null;
  aggregate_id: number | null;
  round_id: number | null;
  state_id: number;
  venue_id: number | null;
  name: string | null;
  starting_at: string | null;
  starting_at_timestamp: number;
  result_info: string | null;
  leg: string;
  details: string | null;
  length: number | null;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  league?: { id: number; name: string; image_path: string | null };
  participants?: LiveParticipant[];
  scores?: LiveScore[];
  state?: LiveMatchState;
  periods?: Period[];
}

// ─── Standings ───────────────────────────────────────────────────────────────

export interface StandingEntry {
  position: number;
  team_id: number;
  team_name: string;
  team_image: string;
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
}

// ─── Scorers ─────────────────────────────────────────────────────────────────

export interface Scorer {
  id: number;
  player_name?: string;
  total?: number;
  player_image?: string;
  pagination?: {
    has_more: boolean;
    next_page: number | null;
  };
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export interface Favorite {
  id: number;
  name?: string;
  emblem?: string;
  leagueId?: number;
  team_id?: number;
  team_name?: string;
  team_image?: string;
}
