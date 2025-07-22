// ✅ Updated TmdbWatchlistService with signal support
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { WatchlistMovie } from '../../models/movie';
import { LanguageService } from './language-service.service';

@Injectable({ providedIn: 'root' })
export class TmdbWatchlistService {
  watchlistCount = signal(0);
  favoriteMovieMap = signal<Record<number, boolean>>({});

  private readonly apiKey = environment.tmdb.apiKey;
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private sessionId: string | null = null;
  private accountId: number | null = null;

  private http = inject(HttpClient);
  private languageService = inject(LanguageService);

  async getWatchlist(type: 'movies' | 'tv'): Promise<WatchlistMovie[]> {
    this.ensureSession();
    const lang = this.languageService.getLanguage().code;

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('session_id', this.sessionId!)
      .set('language', lang);

    const resp = await firstValueFrom(
      this.http.get<{ results: any[] }>(
        `${this.apiUrl}/account/${this.accountId}/watchlist/${type}`,
        { params }
      )
    );

    if (type === 'movies') {
      this.favoriteMovieMap.set(
        Object.fromEntries(resp.results.map((movie) => [movie.id, true]))
      );
    }

    return resp.results.map(item => ({
      id: item.id,
      title: item.title ?? item.name,
      date: item.release_date ?? item.first_air_date ?? '',
      rate: Math.round((item.vote_average ?? 0) * 10),
      poster_path: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : '',
      vote_count: item.vote_count ?? 0,
      overview: item.overview ?? '',
      media_type: type === 'movies' ? 'movie' : 'tv',
    }));
  }

  async addMovieToWatchlist(movieId: number) {
    return this.toggleWatchlist('movie', movieId, true);
  }

  async removeMovieFromWatchlist(movieId: number) {
    return this.toggleWatchlist('movie', movieId, false);
  }

  async addTVToWatchlist(tvId: number) {
    return this.toggleWatchlist('tv', tvId, true);
  }

  async removeTVFromWatchlist(tvId: number) {
    return this.toggleWatchlist('tv', tvId, false);
  }

  getWatchlistCount(): number {
    return this.watchlistCount();
  }

  setSession(sessionId: string, accountId: number): void {
    this.sessionId = sessionId;
    this.accountId = accountId;
    this.loadWatchlistCount();
  }

  private loadWatchlistCount(): void {
    this.ensureSession();
    const lang = this.languageService.getLanguage().code;

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('session_id', this.sessionId!)
      .set('language', lang);

    firstValueFrom(
      this.http.get<{ total_results: number }>(
        `${this.apiUrl}/account/${this.accountId}/watchlist/movies`,
        { params }
      )
    ).then((resp) => {
      this.watchlistCount.set(resp.total_results);
    }).catch(err => {
      console.error('Failed to load watchlist count', err);
      this.watchlistCount.set(0);
    });
  }

  private ensureSession(): void {
    if (!this.sessionId || this.accountId == null) {
      throw new Error('TMDB session/account not initialized');
    }
  }

  private async toggleWatchlist(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  watch: boolean
): Promise<void> {
  this.ensureSession();

  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('session_id', this.sessionId!);

  const body = {
    media_type: mediaType,
    media_id: mediaId,
    watchlist: watch
  };

  await firstValueFrom(
    this.http.post<any>(
      `${this.apiUrl}/account/${this.accountId}/watchlist`,
      body,
      { params }
    )
  );

   this.favoriteMovieMap.update((map) => ({
    ...map,
    [mediaId]: watch
  }));

   this.watchlistCount.update((count) => watch ? count + 1 : Math.max(count - 1, 0));
}

}
