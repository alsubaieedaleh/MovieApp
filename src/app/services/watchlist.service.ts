// src/app/services/tmdb-watchlist.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { WatchlistMovie } from '../models/watchlist-movie';
import { LanguageService } from './language-service.service';

@Injectable({ providedIn: 'root' })
export class TmdbWatchlistService {
  watchlistCount = signal(0);
  private readonly apiKey = environment.tmdb.apiKey;
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private sessionId: string | null = null;
  private accountId: number | null = null;
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);
  constructor(
  
  ) {
    this.initSession();
  }
  
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


private async toggleWatchlist(
  mediaType: 'movie' | 'tv',
  mediaId: number,
  watch: boolean
): Promise<any> {
  this.ensureSession();
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('session_id', this.sessionId!);

  const body = {
    media_type: mediaType,
    media_id: mediaId,
    watchlist: watch
  };

  return firstValueFrom(
    this.http.post<any>(
      `${this.apiUrl}/account/${this.accountId}/watchlist`,
      body,
      { params }
    )
  );
}


  // Explicit remove methods
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

  private ensureSession(): void {
    if (!this.sessionId || this.accountId == null) {
      throw new Error('TMDB session/account not ready');
    }
  }

  private async initSession(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('request_token');
      const approved = params.get('approved');
      const savedSession = localStorage.getItem('tmdb_session_id');
      const savedAccount = localStorage.getItem('tmdb_account_id');
      if (savedSession && savedAccount) {
        this.sessionId = savedSession;
        this.accountId = Number(savedAccount);
        await this.fetchWatchlistCount();
        return;
      }
      if (token && approved === 'true') {
        await this.finalizeSession(token);
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }
      const tokenResp = await firstValueFrom(
        this.http.get<{ request_token: string }>(
          `${this.apiUrl}/authentication/token/new`,
          { params: new HttpParams().set('api_key', this.apiKey) }
        )
      );
      window.location.href =
        `https://www.themoviedb.org/authenticate/${tokenResp.request_token}` +
        `?redirect_to=${encodeURIComponent(window.location.href)}`;
    } catch (err) {
      console.error('initSession error', err);
    }
  }

  private async finalizeSession(requestToken: string): Promise<void> {
    const sessResp = await firstValueFrom(
      this.http.post<{ session_id: string }>(
        `${this.apiUrl}/authentication/session/new`,
        { request_token: requestToken },
        { params: new HttpParams().set('api_key', this.apiKey) }
      )
    );
    this.sessionId = sessResp.session_id;
    localStorage.setItem('tmdb_session_id', sessResp.session_id);
    await this.fetchAccountId();
    await this.fetchWatchlistCount();
  }

  private async fetchAccountId(): Promise<number> {
    if (!this.sessionId) throw new Error('No sessionId');
    const accResp = await firstValueFrom(
      this.http.get<{ id: number }>(
        `${this.apiUrl}/account`,
        { params: new HttpParams()
            .set('api_key', this.apiKey)
            .set('session_id', this.sessionId!) }
      )
    );
    this.accountId = accResp.id;
    localStorage.setItem('tmdb_account_id', `${accResp.id}`);
    return accResp.id;
  }

  private async fetchWatchlistCount(): Promise<number> {
    this.ensureSession();
    const lang = this.languageService.getLanguage().code;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('session_id', this.sessionId!)
      .set('language', lang);
    const resp = await firstValueFrom(
      this.http.get<{ total_results: number }>(
        `${this.apiUrl}/account/${this.accountId}/watchlist/movies`,
        { params }
      )
    );
    this.watchlistCount.set(resp.total_results);
    return resp.total_results;
  }
}
