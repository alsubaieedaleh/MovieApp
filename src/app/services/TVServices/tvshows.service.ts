// src/app/services/MovieServices/tvshows.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Movie } from '../../models/movie'; // reuse Movie interface

@Injectable({
  providedIn: 'root'
})
export class TVShowsService {
  private readonly API_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY = environment.tmdb.apiKey;

  constructor(private http: HttpClient) {}

  getPopularTVShows(page: number = 1): Observable<Movie[]> {
    return this.http.get<any>(`${this.API_URL}/tv/popular`, {
      params: {
        api_key: this.API_KEY,
        language: 'en-US',
        page: page
      }
    }).pipe(
      map(res => res.results.map((show: any) => ({
        id: show.id,
        date: show.first_air_date,
        title: show.name,
        poster: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
        overview: show.overview,
        vote_average: show.vote_average
      })))
    );
  }
}
