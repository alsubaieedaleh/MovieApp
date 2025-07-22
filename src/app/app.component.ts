// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { TmdbWatchlistService } from './services/shared/watchlist.service';
import { LanguageService } from './services/shared/language-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'movieApp';

  private readonly apiKey = environment.tmdb.apiKey;
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  private http = inject(HttpClient);
  private watchlistService = inject(TmdbWatchlistService);
  private languageService = inject(LanguageService);

  async ngOnInit(): Promise<void> {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('request_token');
      const approved = params.get('approved');
      const savedSession = localStorage.getItem('tmdb_session_id');
      const savedAccount = localStorage.getItem('tmdb_account_id');

      if (savedSession && savedAccount) {
        this.watchlistService.setSession(savedSession, Number(savedAccount));
        await this.watchlistService.getWatchlistCount();
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
      console.error('Session init error:', err);
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

    localStorage.setItem('tmdb_session_id', sessResp.session_id);

    const accResp = await firstValueFrom(
      this.http.get<{ id: number }>(
        `${this.apiUrl}/account`,
        {
          params: new HttpParams()
            .set('api_key', this.apiKey)
            .set('session_id', sessResp.session_id)
        }
      )
    );

    localStorage.setItem('tmdb_account_id', `${accResp.id}`);
    this.watchlistService.setSession(sessResp.session_id, accResp.id);
    await this.watchlistService.getWatchlistCount();
  }
}
