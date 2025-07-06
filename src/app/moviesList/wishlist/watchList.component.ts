import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { WatchlistMovie } from '../../models/watchlist-movie';
import { WatchlistCardComponent } from '../../components/watchlist-card/watchlist-card.component';

@Component({
  selector: 'app-watchList',
  standalone: true,
  imports: [CommonModule, WatchlistCardComponent],
  templateUrl: './watchList.component.html',
  styleUrls: ['./watchList.component.scss'],
})
export class WatchListComponent implements OnInit {
  movies = signal<WatchlistMovie[]>([]);
  loading = signal(true);

  constructor(private tmdbService: TmdbWatchlistService) {}

  async ngOnInit(): Promise<void> {
    try {
      const TVresults = await this.tmdbService.getWatchlist('tv');
      const Moviesresults = await this.tmdbService.getWatchlist('movies');
      this.movies.set([...Moviesresults, ...TVresults]);
    } catch (error) {
      console.error('Failed to load watchlist', error);
    } finally {
      this.loading.set(false);
    }
  }
  async onRemove(movieId: number) {
    try {
      await this.tmdbService.removeFromWatchlist(movieId);
      const TVresults = await this.tmdbService.getWatchlist('tv');
      const Moviesresults = await this.tmdbService.getWatchlist('movies');
      this.movies.set([...Moviesresults, ...TVresults]);
    } catch (err) {
      console.error('Error removing from watchlist', err);
    }
  }
}
