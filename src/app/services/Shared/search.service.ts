 import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { LanguageService } from './language-service.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

 
    private http = inject(HttpClient);
   private languageService = inject(LanguageService);
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
