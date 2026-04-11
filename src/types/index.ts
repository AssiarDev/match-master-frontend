// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  name?: string
  username?: string
  email?: string
  createdAt?: string
}

// ─── Competitions ────────────────────────────────────────────────────────────

export interface Competition {
  id: number
  name: string
  image_path?: string
  emblem?: string
}

export interface League {
  name: string
  code: number
  logo?: string
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export interface Team {
  id: number
  name: string
  image: string
  shortName?: string
}

export interface MatchParticipant {
  id: number
  name: string
  short_code?: string
  image_path?: string
  meta?: {
    location: 'home' | 'away'
  }
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export interface ScoreDetail {
  score: {
    participant: 'home' | 'away'
    goals: number
  }
}

export interface ScoresWrapper {
  data?: ScoreDetail[]
}

export interface Match {
  id: number
  starting_at: string
  state_id: number
  participants?: MatchParticipant[]
  scores?: ScoreDetail[] | ScoresWrapper
}

export interface Round {
  fixtures?: Match[]
}

export interface Stage {
  rounds?: Round[]
}

export interface LeagueMatchGroup {
  flag?: string
  matches: Match[]
}

export type MatchesByLeague = Record<string, LeagueMatchGroup>

// ─── Standings ───────────────────────────────────────────────────────────────

export interface StandingEntry {
  position: number
  team_id: number
  team_name: string
  team_image: string
  points: number
  played: number
  won: number
  draw: number
  lost: number
  goals_for: number
  goals_against: number
  goal_diff: number
}

// ─── Scorers ─────────────────────────────────────────────────────────────────

export interface Scorer {
  id: number
  player_name?: string
  total?: number
  player_image?: string
  pagination?: {
    has_more: boolean
    next_page: number | null
  }
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export interface Favorite {
  id: number
  name?: string
  emblem?: string
  leagueId?: number
  team_id?: number
  team_name?: string
  team_image?: string
}
