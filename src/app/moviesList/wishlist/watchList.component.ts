// src/app/moviesList/watchList/watchList.component.ts
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
  items = signal<WatchlistMovie[]>([]);
  loading = signal(true);

  constructor(private tmdbService: TmdbWatchlistService) {}

  async ngOnInit(): Promise<void> {
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
      const [movies, tv] = await Promise.all([
        this.tmdbService.getWatchlist('movies'),
        this.tmdbService.getWatchlist('tv'), 
      ]);
      this.items.set([...movies, ...tv]);
    } catch (err) {
      console.error('Error removing from watchlist', err);
    }
  }
}
