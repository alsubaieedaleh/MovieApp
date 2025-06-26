import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Movie } from '../../models/movie';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

  recommendations = signal<Movie[]>([]);

  constructor(private http: HttpClient) {}

  loadTVRecommendations(tvShowId: number) {
    const url = `${this.API_URL}/tv/${tvShowId}/recommendations`;
    const params = { api_key: this.apiKey };

    this.http.get<{ results: any[] }>(url, { params })
      .pipe(
        map(res => res.results.map(tv => ({
          id: tv.id,
          title: tv.name,
          poster: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
          rate: tv.vote_average,
          date: tv.first_air_date,
        }))),
        catchError(err => {
          console.error('Failed to fetch recommendations:', err);
          return of([]);
        })
      )
      .subscribe(mapped => this.recommendations.set(mapped));
  }
}
