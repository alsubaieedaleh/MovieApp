 import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { MovieDetails } from '../../models/movieDetails';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class MovieDetailsService {
  movie   = signal<MovieDetails | null>(null);
  loading = signal(false);

   private http = inject(HttpClient);
  private languageService = inject(LanguageService);

   loadDetails(movieId: number): Observable<MovieDetails> {
    this.loading.set(true);
    try {
      const langCode = this.languageService.getLanguage().code;
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const params = {
        api_key: environment.tmdb.apiKey,
        language: langCode
      };
      return this.http.get<MovieDetails>(url, { params });
    } finally {
      this.loading.set(false);
    }
  }
}
