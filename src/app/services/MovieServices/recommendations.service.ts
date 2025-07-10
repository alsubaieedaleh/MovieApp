 import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { Movie } from '../../models/movie';
import { LanguageService } from '../language-service.service';

@Injectable({ providedIn: 'root' })
export class RecommendationsService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.tmdb.apiKey;

 
    private http = inject(HttpClient);
   private languageService = inject(LanguageService);

  getRecommendations(movieId: number): Observable<Movie[]> {
    const langCode = this.languageService.getLanguage().code;

    const url = `${this.apiUrl}/movie/${movieId}/recommendations`;
    const params = {
      api_key: this.apiKey,
      language: langCode,
      page: '1'
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
