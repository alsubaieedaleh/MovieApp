// src/app/services/tmdb-watchlist.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { WatchlistMovie } from '../models/watchlist-movie';

@Injectable({ providedIn: 'root' })
export class TmdbWatchlistService {
  watchlistCount = signal(0);

  private readonly apiKey = environment.tmdb.apiKey;
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  private sessionId: string | null = null;
  private accountId: number | null = null;

  constructor(private http: HttpClient) {
    // Kick off session flow (redirect-based). Cannot await in constructor.
    this.initSession();
  }
/**
 * Fetch the list of movies in the user's watchlist.
 * @returns Promise<Movie[]>
 */
async getWatchlist(): Promise<WatchlistMovie[]> {
  if (!this.sessionId || this.accountId == null) {
    throw new Error('Missing sessionId or accountId');
  }

  try {
    await this.delay(2000);
    const response = await firstValueFrom(
      this.http.get<{ results: WatchlistMovie[] }>(
        `${this.apiUrl}/account/${this.accountId}/watchlist/movies`,
        {
          params: {
            api_key: this.apiKey,
            session_id: this.sessionId,
          },
        }
      )
    );
       return response.results.map((item:any) => ({
       id: item.id,
       title: item.title,
       date: item.release_date,
       rate: Math.round((item.vote_average ?? 0) * 10),
       poster: item.poster_path
         ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
         : '',
       voteCount: item.vote_count ?? 0,
       overview: item.overview ?? '',
     } as WatchlistMovie));
  } catch (err) {
    console.error('getWatchlist error', err);
    throw err;
  }
}

  /** Simple delay helper */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 
  private async initSession(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const requestToken = params.get('request_token');
      const approved = params.get('approved');

      const savedSession = localStorage.getItem('tmdb_session_id');
      const savedAccount = localStorage.getItem('tmdb_account_id');

      if (savedSession) {
        this.sessionId = savedSession;
        if (savedAccount) {
          this.accountId = Number(savedAccount);
          // fetch count but ignore errors
          try {
            await this.fetchWatchlistCount();
          } catch {}
        } else {
          try {
            await this.fetchAccountId();
            await this.fetchWatchlistCount();
          } catch (e) {
            console.error('Error fetching account after saved session', e);
          }
        }
        return;
      }

      if (requestToken && approved === 'true') {
        // finalize session flow
        await this.finalizeSession(requestToken);
        // clean URL
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      // No session: request new token and redirect after delay
      await this.delay(2000);
      const tokenResp = await firstValueFrom(
        this.http.get<{ request_token: string }>(
          `${this.apiUrl}/authentication/token/new`,
          { params: { api_key: this.apiKey } }
        )
      );
      const redirectTo = encodeURIComponent(window.location.href);
      window.location.href = 
        `https://www.themoviedb.org/authenticate/${tokenResp.request_token}?redirect_to=${redirectTo}`;
    } catch (err) {
      console.error('initSession error', err);
    }
  }

  /**
   * Exchange approved request_token for session_id, then fetch accountId & count.
   */
  private async finalizeSession(requestToken: string): Promise<void> {
    try {
      const sessResp = await firstValueFrom(
        this.http.post<{ session_id: string }>(
          `${this.apiUrl}/authentication/session/new`,
          { request_token: requestToken },
          { params: { api_key: this.apiKey } }
        )
      );
      this.sessionId = sessResp.session_id;
      localStorage.setItem('tmdb_session_id', sessResp.session_id);

      await this.fetchAccountId();
      await this.fetchWatchlistCount();
    } catch (err) {
      console.error('finalizeSession error', err);
    }
  }

  /**
   * Fetch numeric account ID for current session.
   * @returns account ID
   */
  private async fetchAccountId(): Promise<number> {
    if (!this.sessionId) {
      throw new Error('No sessionId');
    }
    try {
      await this.delay(2000);
      const accResp = await firstValueFrom(
        this.http.get<{ id: number }>(
          `${this.apiUrl}/account`,
          { params: { api_key: this.apiKey, session_id: this.sessionId } }
        )
      );
      this.accountId = accResp.id;
      localStorage.setItem('tmdb_account_id', String(accResp.id));
      return accResp.id;
    } catch (err) {
      console.error('fetchAccountId error', err);
      throw err;
    }
  }

  /**
   * Fetch watchlist count. Updates signal.
   * @returns total_results count
   */
  private async fetchWatchlistCount(): Promise<number> {
    if (!this.sessionId || this.accountId == null) {
      throw new Error('Missing sessionId or accountId');
    }
    try {
      await this.delay(2000);
      const resp = await firstValueFrom(
        this.http.get<{ total_results: number }>(
          `${this.apiUrl}/account/${this.accountId}/watchlist/movies`,
          { params: { api_key: this.apiKey, session_id: this.sessionId } }
        )
      );
      this.watchlistCount.set(resp.total_results);
      return resp.total_results;
    } catch (err) {
      console.error('fetchWatchlistCount error', err);
      throw err;
    }
  }

  /**
   * Add a movie to watchlist. Returns when done.
   * @param movieId TMDB movie ID
   * @returns response or throws on error
   */
  async addToWatchlist(movieId: number): Promise<any> {
    if (!this.sessionId || this.accountId == null) {
      return Promise.reject(new Error('TMDB session/account not ready'));
    }
    try {
      await this.delay(2000);
      const resp = await firstValueFrom(
        this.http.post<any>(
          `${this.apiUrl}/account/${this.accountId}/watchlist`,
          { media_type: 'movie', media_id: movieId, watchlist: true },
          { params: { api_key: this.apiKey, session_id: this.sessionId } }
        )
      );
      this.watchlistCount.set(this.watchlistCount() + 1);
      return resp;
    } catch (err) {
      console.error('addToWatchlist error', err);
      throw err;
    }
  }

  getWatchlistCount(): number {
    return this.watchlistCount();
  }
 
async removeFromWatchlist(movieId: number): Promise<any> {
  if (!this.sessionId || this.accountId == null) {
    return Promise.reject(new Error('TMDB session/account not ready'));
  }
  try {
    await this.delay(2000);
    const resp = await firstValueFrom(
      this.http.post<any>(
        `${this.apiUrl}/account/${this.accountId}/watchlist`,
        { media_type: 'movie', media_id: movieId, watchlist: false },
        { params: { api_key: this.apiKey, session_id: this.sessionId } }
      )
    );
    this.watchlistCount.set(Math.max(this.watchlistCount() - 1, 0));
    return resp;
  } catch (err) {
    console.error('removeFromWatchlist error', err);
    throw err;
  }
}

}
