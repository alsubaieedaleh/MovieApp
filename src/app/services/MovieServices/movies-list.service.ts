// src/app/services/MovieServices/movies-list.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class MoviesListService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  getMovies(page: number, minDate: string, maxDate: string): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;

    const params: Record<string, string> = {
      api_key: this.apiKey,
      language: langCode,
      page: String(page),
      primary_release_date_gte: minDate,
      primary_release_date_lte: maxDate,
      include_adult: 'false',
      include_video: 'false',
      sort_by: 'popularity.desc'
    };

    return of(null).pipe(
      delay(2000),
      switchMap(() =>
        this.http.get<any>(`${this.apiUrl}/discover/movie`, { params })
      ),
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
