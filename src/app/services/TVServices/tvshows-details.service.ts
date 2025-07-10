 import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../models/movieDetails';
 import { LanguageService } from '../language-service.service';
import { Observable, throwError } from 'rxjs';
import { delay, map, tap, finalize, catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class TVShowsDetailsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY = environment.tmdb.apiKey;

  tvShow = signal<MovieDetails | null>(null);
  loading = signal(false);

   private http = inject(HttpClient);
  private languageService = inject(LanguageService);
 

 loadTVShowDetails(id: number): Observable<MovieDetails> {
  this.loading.set(true);
  const langCode = this.languageService.getLanguage().code;

  return this.http
    .get<any>(`${this.API_URL}/tv/${id}`, {
      params: {
        api_key: this.API_KEY,
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
}
