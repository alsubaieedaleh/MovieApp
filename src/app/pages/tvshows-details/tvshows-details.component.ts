// src/app/tvshows-details/tvshows-details.component.ts
import { Component, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap } from 'rxjs';

import { TVShowsDetailsService } from '../../services/TVServices/tvshows-details.service';
import { TVRecommendationsService } from '../../services/TVServices/recommendations.service';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { MovieDetails } from '../../models/movieDetails';
import { Movie } from '../../models/movie';
import { MovieDetailsCardComponent } from '../../components/movie-details-card/movie-details-card.component';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-tvshows-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieDetailsCardComponent, CardComponent],
  templateUrl: './tvshows-details.component.html',
  styleUrls: ['./tvshows-details.component.scss'],
})
export class TVShowsDetailsComponent {
  private detailsService = inject(TVShowsDetailsService);
  private recService = inject(TVRecommendationsService);
  private watchlistService = inject(TmdbWatchlistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Error and loading signals */
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  /** TV show details via toSignal */
  tvShow$: Signal<MovieDetails | null> = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/']);
          return of(null);
        }
        this.loading.set(true);
        this.error.set(null);
        return this.detailsService.loadTVShowDetails(id).pipe(
          catchError(err => {
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

   recommendations: Signal<Movie[]> = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) return of([]);
        return this.recService.loadTVRecommendations(id).pipe(
          catchError(err => {
            console.error('Failed to load recommendations:', err);
            this.error.set('Failed to load recommendations');
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] }
  );

  /** Computed stars */
  get filledStars(): number {
    return Math.round((this.tvShow$()?.vote_average ?? 0) / 2);
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  addToWatchlist(id: number) {
    if (!id) {
      console.warn('Missing TV show ID');
      return;
    }
    this.watchlistService.addTVToWatchlist(id)
       .catch(err => console.error('Watchlist error', err));
  }

  navigateToTVShowDetails(id: number) {
    this.router.navigate(['/tv-shows', id]);
  }
}
