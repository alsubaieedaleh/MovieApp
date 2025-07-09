import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TVShowsService } from '../services/TVServices/tvshows.service';
import { Movie } from '../models/movie';
import { CardComponent } from '../components/card/card.component';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../components/loading/loading.component';

@Component({
  selector: 'app-tvshows',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss'],
})
export class TVShowsComponent implements OnInit {
  tvShows = signal<Movie[]>([]);
  currentPage = signal(1);
  loading = signal(true);

  private tvShowsService = inject(TVShowsService);
  private watchlistService = inject(TmdbWatchlistService);
  public router = inject(Router);

  ngOnInit(): void {
    this.loadTVShows(this.currentPage());
  }

  loadTVShows(page: number) {
    this.loading.set(true);
    this.currentPage.set(page);
    this.tvShowsService.getPopularTVShows(page).subscribe({
      next: (data) => this.tvShows.set(data),
      error: (err) => console.error('Failed to load TV shows', err),
      complete: () => this.loading.set(false),
    });
  }

  addToWatchlist(show: Movie) {
    if (!show.id) {
      console.error('Show ID is missing');
      return;
    }
    this.watchlistService
      .addTVToWatchlist(show.id)
      .then(() => console.log(`"${show.title}" added to watchlist.`))
      .catch((err) => console.error('Watchlist error', err));
  }
}
