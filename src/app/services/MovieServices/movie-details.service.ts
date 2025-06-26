import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { MovieDetails } from "../../models/movieDetails"

@Injectable({ providedIn: 'root' })
export class MovieDetailsService {
  movie = signal<MovieDetails | null>(null);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  async loadDetails(movieId: number): Promise<void> {
    this.loading.set(true);
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      const params = { api_key: environment.tmdb.apiKey };
      const resp = await firstValueFrom(this.http.get<MovieDetails>(url, { params }));
      this.movie.set(resp);
    } finally {
      this.loading.set(false);
    }
  }
}
