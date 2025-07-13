import { Component, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { LanguageService } from '../services/language-service.service';
import { WatchlistMovie } from '../models/watchlist-movie';
import { WatchlistCardComponent } from '../components/watchlist-card/watchlist-card.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../components/loading/loading.component';

import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, WatchlistCardComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchListComponent {
  private tmdbService = inject(TmdbWatchlistService);
  private languageService = inject(LanguageService);

   loading = signal<boolean>(true);

   private reloadTrigger = new BehaviorSubject<void>(undefined);

   items: Signal<WatchlistMovie[]> = toSignal(
    this.reloadTrigger.pipe(
      startWith(undefined),
      switchMap(() => from(this.loadList())),
      startWith([] as WatchlistMovie[])
    ),
    { initialValue: [] }
  );

  constructor() {
     this.languageService.currentLang$.subscribe(() => this.reloadTrigger.next());
  }

   
  private async loadList(): Promise<WatchlistMovie[]> {
    this.loading.set(true);
    try {
      const [movies, tv] = await Promise.all([
        this.tmdbService.getWatchlist('movies'),
        this.tmdbService.getWatchlist('tv'),
      ]);
      return [...movies, ...tv];
    } catch (error) {
      console.error('Failed to load watchlist', error);
      return [];
    } finally {
      this.loading.set(false);
    }
  }
 
  async onRemove(item: WatchlistMovie) {
    try {
      if (item.media_type === 'tv') {
        await this.tmdbService.removeTVFromWatchlist(item.id);
      } else {
        await this.tmdbService.removeMovieFromWatchlist(item.id);
      }
      this.reloadTrigger.next();
    } catch (err) {
      console.error('Error removing from watchlist', err);
    }
  }
}
