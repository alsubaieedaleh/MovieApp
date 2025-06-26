import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { CardComponent } from '../../components/card/card.component';
import { WatchlistMovie } from '../../models/watchlist-movie';
import { WatchlistCardComponent } from '../../components/watchlist-card/watchlist-card.component';

@Component({
  selector: 'app-watchList',
  standalone: true,
  imports: [CommonModule, CardComponent, WatchlistCardComponent],
  templateUrl: './watchList.component.html',
  styleUrls: ['./watchList.component.scss']
})
export class WatchListComponent implements OnInit {
  movies = signal<WatchlistMovie[]>([]);
  loading = signal(true);

  constructor(private tmdbService: TmdbWatchlistService) {}

  async ngOnInit(): Promise<void> {
    try {
      const results = await this.tmdbService.getWatchlist();
      this.movies.set(results ?? []);
    } catch (error) {
      console.error('Failed to load watchlist', error);
    } finally {
      this.loading.set(false);
    }
  }
  async onRemove(movieId: number) {
  try {
    await this.tmdbService.removeFromWatchlist(movieId);
    const refreshed = await this.tmdbService.getWatchlist();
    this.movies.set(refreshed ?? []);
  } catch (err) {
    console.error('Error removing from watchlist', err);
  }
}

}
