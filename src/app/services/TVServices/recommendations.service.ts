import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Movie } from '../../models/movie';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class TVRecommendationsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

  private http = inject(HttpClient);
  private languageService = inject(LanguageService);

  /**
   * Fetches TV show recommendations and returns an Observable<Movie[]>
   */
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
}
