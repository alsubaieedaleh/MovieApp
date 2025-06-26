 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Movie } from '../../models/movie';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

  constructor(private http: HttpClient) {}

  
  getRecommendations(movieId: number): Observable<Movie[]> {
    const url = `${this.apiUrl}/movie/${movieId}/recommendations`;
    const params = {
      api_key: this.apiKey,
      language: 'en-US',
      page: 1
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
}
