// src/app/services/MovieServices/tvshows-details.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../models/movieDetails'; // has a title field
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TVShowsDetailsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY = environment.tmdb.apiKey;

  tvShow = signal<MovieDetails | null>(null);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  loadTVShowDetails(id: number) {
    this.loading.set(true);
    this.http.get<any>(`${this.API_URL}/tv/${id}`, {
      params: {
        api_key: this.API_KEY,
        language: 'en-US'
      }
    }).pipe(
      delay(500),
      // map TMDB TV show response into your MovieDetails type,
      // copying `name` → `title`
      map(resp => ({
        ...resp,
        title: resp.name || resp.original_name || 'Untitled'
      } as MovieDetails)),
      tap(show => this.tvShow.set(show))
    ).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load TV show details', err);
        this.loading.set(false);
      }
    });
  }
}
