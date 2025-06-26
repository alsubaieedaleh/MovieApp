export interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  original_language: string;
  production_companies: { id: number; logo_path: string | null; name: string }[];
  homepage: string | null;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
 }
