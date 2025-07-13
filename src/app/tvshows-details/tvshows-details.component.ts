import { Component, Signal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, map } from 'rxjs';

import { TVShowsDetailsService } from '../services/TVServices/tvshows-details.service';
import { TVRecommendationsService } from '../services/TVServices/recommendations.service';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { MovieDetails } from '../models/movieDetails';
import { Movie } from '../models/movie';
import { MovieDetailsCardComponent } from '../components/movie-details-card/movie-details-card.component';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-tvshows-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieDetailsCardComponent, CardComponent],
  templateUrl: './tvshows-details.component.html',
  styleUrls: ['./tvshows-details.component.scss'],
})
export class TVShowsDetailsComponent {
  private detailsService = inject(TVShowsDetailsService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private watchlistService = inject(TmdbWatchlistService);
  private recService = inject(TVRecommendationsService);

  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  recommendations = signal<Movie[]>([]);

  tvShow$: Signal<MovieDetails | null> = toSignal<MovieDetails | null>(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/']);
          return of(null);
        }

        this.loading.set(true);
        this.error.set(null);

        return this.detailsService.loadTVShowDetails(id).pipe(
          catchError((err) => {
            console.error('Error fetching TV show:', err);
            this.error.set('Failed to load TV show details.');
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    ),
    { initialValue: null }
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadRecommendations(id);
    }
  }

  get filledStars(): number {
    return Math.round((this.tvShow$()?.vote_average ?? 0) / 2);
  }

  get starsArray(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  loadRecommendations(tvShowId: number) {
    this.recService.loadTVRecommendations(tvShowId).subscribe({
      next: (recs) => this.recommendations.set(recs),
      error: (err) => {
        console.error('Failed to load recommendations:', err);
        this.error.set('Failed to load recommendations');
      },
    });
  }

  addToWatchlist(id: number) {
    if (!id) {
      console.warn('Missing TV show ID');
      return;
    }
    this.watchlistService
      .addTVToWatchlist(id)
      .then(() => console.log(`${id} added to watchlist.`))
      .catch((err) => console.error('Watchlist error', err));
  }

  navigateToTVShowDetails(id: number) {
    this.router.navigate(['/tv-shows', id]);
  }
}
