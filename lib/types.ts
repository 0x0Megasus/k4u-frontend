export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Category {
  id: number;
  name: string;
  logo?: string;
  child_count?: number;
  [key: string]: unknown;
}

export interface Channel {
  id: number;
  name: string;
  logo?: string;
  is_hide?: number;
  priority?: number;
  [key: string]: unknown;
}

export interface MatchTeam {
  name: string;
  logo: string;
}

export interface MatchEvent {
  id: number;
  start_time: number;
  end_time: number;
  champions: string;
  commentary: string;
  team_1: MatchTeam;
  team_2: MatchTeam;
  channel: string;
}

export interface StreamSource {
  name: string;
  url: string;
  url_type: number;
  user_agent?: string;
  referer?: string;
  event_channel_id?: string | null;
  headers?: Record<string, string>;
  drm?: string | null;
}

/** Tokenized stream source returned by the backend to hide upstream URLs. */
export interface StreamToken {
  name: string;
  token: string;
}
