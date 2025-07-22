// src/app/movie-details/movie-details.component.ts
import { Component, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
 import { MovieDetails } from '../../models/movieDetails';
import { TmdbWatchlistService } from '../../services/Shared/watchlist.service';
 import { Movie } from '../../models/movie';
import { MovieDetailsCardComponent } from '../../components/movie-details-card/movie-details-card.component';
import { CardComponent } from '../../components/card/card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap } from 'rxjs';
import {MovieServices} from '../../services/movie-services';
@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieDetailsCardComponent, CardComponent],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  private movieServices = inject(MovieServices);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private watchlistService = inject(TmdbWatchlistService);
 
   error = signal<string | null>(null);
  loading = signal<boolean>(true);

   movie$: Signal<MovieDetails | null> = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/']);
          return of(null);
        }
        this.loading.set(true);
        this.error.set(null);
        return this.movieServices.loadDetails(id).pipe(
          catchError(err => {
            console.error('Error fetching movie:', err);
            this.error.set('Failed to load movie details.');
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
        return this.movieServices.getRecommendations(id).pipe(
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

 

  addToWatchlist(id: number) {
    if (!id) {
      console.warn('Missing movie ID');
      return;
    }
    this.watchlistService.addMovieToWatchlist(id)
      .catch(err => console.error('Watchlist error', err));
  }

  navigateToMovieDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }
}
