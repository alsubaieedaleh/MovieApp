import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, map, catchError, of, delay, finalize, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Movie } from "../models/movie";
import { LanguageService } from "./shared/language-service.service";
import { MovieDetails } from "../models/movie";


@Injectable({ providedIn: 'root' })

export class TvShowsServices {

private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;
 
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);

    tvShow = signal<MovieDetails | null>(null);
  loading = signal(false);



 loadTVShowDetails(id: number): Observable<MovieDetails> {
  this.loading.set(true);
  const langCode = this.languageService.getLanguage().code;

  return this.http
    .get<any>(`${this.API_URL}/tv/${id}`, {
      params: {
        api_key: this.apiKey,
        language: langCode
      }
    })
    .pipe(
      delay(500),
      map(resp => ({
        ...resp,
        title: resp.name || resp.original_name || 'Untitled'
      } as MovieDetails)),
      tap(show => this.tvShow.set(show)),
      finalize(() => this.loading.set(false)),
      catchError(err => {
        console.error('Failed to load TV show details', err);
        // you could also set an error signal here if you have one
        this.loading.set(false);
        // rethrow if callers need to react, or return a default
        return throwError(() => err);
      })
    );
}
 
  loadTVRecommendations(tvShowId: number): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;
    const url = `${this.API_URL}/tv/${tvShowId}/recommendations`;

    return this.http
      .get<{ results: any[] }>(url, { params: { api_key: this.apiKey, language: langCode } })
      .pipe(
        map(res =>
          res.results.map(tv => ({
            id: tv.id,
            title: tv.name,
            poster: tv.poster_path
              ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
              : '',
            rate: tv.vote_average,
            date: tv.first_air_date
          } as Movie))
        ),
        catchError(err => {
          console.error('Failed to fetch TV recommendations:', err);
          return of([] as Movie[]);
        })
      );
  }
 getPopularTVShows(page: number = 1): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;
    return this.http
      .get<any>(`${this.API_URL}/tv/popular`, {
        params: {
          api_key: this.apiKey,
          language: langCode,
          page: String(page)
        }
      })
      .pipe(
        map(res =>
          res.results.map((show: any) => ({
            id: show.id,
            date: show.first_air_date,
            title: show.name,
            rate: Math.round((show.vote_average ?? 0) * 10),
            poster: show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : '',
            overview: show.overview,
            vote_average: show.vote_average
          }))
        )
      );
  }
}