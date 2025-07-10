import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, finalize, of, startWith, map } from 'rxjs';

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
  imports: [
    CommonModule,
    RouterModule,
    MovieDetailsCardComponent,
    CardComponent,
  ],
  templateUrl: './tvshows-details.component.html',
  styleUrls: ['./tvshows-details.component.scss'],
})
export class TVShowsDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private detailsService = inject(TVShowsDetailsService);
  private recommendationsService = inject(TVRecommendationsService);
  private watchlistService = inject(TmdbWatchlistService);

  /** MovieDetails|null signal, never undefined */
  tvShow$ = toSignal<MovieDetails | null>(
    this.route.paramMap.pipe(
      map(pm => {
        const raw = pm.get('id');
        const id = raw ? Number(raw) : NaN;
        return Number.isInteger(id) && id > 0 ? id : null;
      }),
      switchMap(id =>
        id !== null
          ? this.detailsService.loadTVShowDetails(id)
          : of(null)
      ),
      catchError(err => {
        console.error('Details error:', err);
        return of(null);
      }),
      startWith(null)
    ),
   );

  /** Movie[] signal, never undefined */
  recommendations$ = toSignal<Movie[]>(
    this.route.paramMap.pipe(
      map(pm => Number(pm.get('id') || '')),
      switchMap(id =>
        Number.isInteger(id) && id > 0
          ? this.recommendationsService.loadTVRecommendations(id)
          : of([] as Movie[])
      ),
      catchError(err => {
        console.error('Recommendations error:', err);
        return of([] as Movie[]);
      }),
      startWith([] as Movie[])
    ),
    { initialValue: [], requireSync: true }
  );

  addToWatchlist(id: number) {
    this.watchlistService
      .addTVToWatchlist(id)
      .then(() => console.log(`${id} added to watchlist.`))
      .catch(err => console.error('Watchlist error:', err));
  }

  navigateToTVShowDetails(id: number) {
    this.router.navigate(['/tv-shows', id]);
  }
}
