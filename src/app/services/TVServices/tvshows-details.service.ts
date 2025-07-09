// src/app/services/MovieServices/tvshows-details.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../models/movieDetails';
import { delay, map, tap } from 'rxjs/operators';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class TVShowsDetailsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY = environment.tmdb.apiKey;

  tvShow = signal<MovieDetails | null>(null);
  loading = signal(false);

   private http = inject(HttpClient);
  private languageService = inject(LanguageService);
 

  loadTVShowDetails(id: number) {
    this.loading.set(true);
    const langCode = this.languageService.getLanguage().code;

    this.http
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
        tap(show => this.tvShow.set(show))
      )
      .subscribe({
        next: () => this.loading.set(false),
        error: err => {
          console.error('Failed to load TV show details', err);
          this.loading.set(false);
        }
      });
  }
}
