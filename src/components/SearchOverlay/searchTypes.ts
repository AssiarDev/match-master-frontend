export interface SearchResult {
  id: number;
  name: string;
  image?: string;
  route: string;
  state?: Record<string, unknown>;
}

export interface SearchSection {
  label: string;
  results: SearchResult[];
}
