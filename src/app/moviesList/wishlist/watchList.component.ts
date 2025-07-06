import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { LanguageService } from '../../services/language-service.service';
import { WatchlistMovie } from '../../models/watchlist-movie';
import { WatchlistCardComponent } from '../../components/watchlist-card/watchlist-card.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, WatchlistCardComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchListComponent implements OnInit {
  items = signal<WatchlistMovie[]>([]);
  loading = signal(true);

  constructor(
    private tmdbService: TmdbWatchlistService,
    private languageService: LanguageService,
   ) {}

  ngOnInit(): void {
    // Reload on language change
    this.languageService.currentLang$.subscribe(() => this.loadList());
    this.loadList();
  }

  private async loadList() {
    this.loading.set(true);
    try {
      const [movies, tv] = await Promise.all([
        this.tmdbService.getWatchlist('movies'),
        this.tmdbService.getWatchlist('tv'),
      ]);
      this.items.set([...movies, ...tv]);
    } catch (error) {
      console.error('Failed to load watchlist', error);
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
      this.loadList();
    } catch (err) {
      console.error('Error removing from watchlist', err);
    }
  }
}