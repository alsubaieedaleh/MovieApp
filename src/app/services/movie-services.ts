import { HttpClient } from '@angular/common/http';
import { signal, inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieDetails } from "../models/movie";
import { LanguageService } from './shared/language-service.service';
import { Movie } from '../models/movie';
@Injectable({ providedIn: 'root' })

export class MovieServices {
    private readonly apiUrl = 'https://api.themoviedb.org/3';
    private readonly apiKey = environment.tmdb.apiKey;
    private http = inject(HttpClient);
    private languageService = inject(LanguageService);
    movie = signal<MovieDetails | null>(null);
    loading = signal(false);

  loadDetails(movieId: number): Observable<MovieDetails> {
    this.loading.set(true);
    try {
      const langCode = this.languageService.getLanguage().code;
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const params = {
        api_key: environment.tmdb.apiKey,
        language: langCode,
      };
      return this.http.get<MovieDetails>(url, { params });
    } finally {
      this.loading.set(false);
    }
  }

  getMovies(
    page: number,
    minDate: string,
    maxDate: string
  ): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;

    const params: Record<string, string> = {
      api_key: this.apiKey,
      language: langCode,
      page: String(page),
      primary_release_date_gte: minDate,
      primary_release_date_lte: maxDate,
      include_adult: 'false',
      include_video: 'false',
      sort_by: 'popularity.desc',
    };

    return of(null).pipe(
      delay(2000),
      switchMap(() =>
        this.http.get<any>(`${this.apiUrl}/discover/movie`, { params })
      ),
      map((response) => {
        if (!response || !Array.isArray(response.results)) {
          return [];
        }
        return response.results.map(
          (item: any) =>
            ({
              id: item.id,
              title: item.title,
              date: item.release_date,
              rate: Math.round((item.vote_average ?? 0) * 10),
              poster: item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : '',
            } as Movie)
        );
      })
    );
  }

  getRecommendations(movieId: number): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;

    const url = `${this.apiUrl}/movie/${movieId}/recommendations`;
    const params = {
      api_key: this.apiKey,
      language: langCode,
      page: '1'
    };

    return this.http.get<any>(url, { params }).pipe(
      map(response =>
        response.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.release_date,
          rate: Math.round((item.vote_average ?? 0) * 10),
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : ''
        } as Movie))
      )
    );
  }

   searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]);
    }

    const langCode = this.languageService.getLanguage().code;

    const params: Record<string,string> = {
      api_key: this.apiKey,
      language: langCode,
      query: query.trim(),
      page: String(page),
      include_adult: 'false'
    };

    return of(null).pipe(
      delay(2000),
      switchMap(() => this.http.get<any>(
        `${this.apiUrl}/search/movie`,
        { params }
      )),
      map(response => {
        if (!response || !Array.isArray(response.results)) {
          return [];
        }
        return response.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.release_date,
          rate: Math.round((item.vote_average ?? 0) * 10),
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : ''
        } as Movie));
      })
    );
  }
}
