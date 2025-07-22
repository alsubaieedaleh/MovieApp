export interface Movie {
  id: number;          
  date: string;        
  title: string;
  rate: number;        
  poster: string;      
  media_type: string;
}
export interface MovieDetails {
  id: number;
  title: string;
  name: string;
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

 export interface WatchlistMovie {
  id: number;
  title: string;
  date: string;         
  poster_path: string;       
  rate: number;       
  vote_count: number;   
  overview: string;     
  media_type: "tv" | "movie";  
}

