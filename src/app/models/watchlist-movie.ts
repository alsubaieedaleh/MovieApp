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
