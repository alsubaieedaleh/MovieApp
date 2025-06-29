// src/app/services/MovieServices/movie-details.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { MovieDetails } from '../../models/movieDetails';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class MovieDetailsService {
  movie   = signal<MovieDetails | null>(null);
  loading = signal(false);

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  async loadDetails(movieId: number): Promise<void> {
    this.loading.set(true);
    try {
      const langCode = this.languageService.getLanguage().code;
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const params = {
        api_key: environment.tmdb.apiKey,
        language: langCode
      };
      const resp = await firstValueFrom(
        this.http.get<MovieDetails>(url, { params })
      );
      this.movie.set(resp);
    } finally {
      this.loading.set(false);
    }
  }
}
