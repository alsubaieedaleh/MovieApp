import { Component, Signal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieDetailsService } from '../services/MovieServices/movie-details.service';
import { MovieDetails } from '../models/movieDetails';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { RecommendationsService } from '../services/MovieServices/recommendations.service';
import { Movie } from '../models/movie';
import { MovieDetailsCardComponent } from '../components/movie-details-card/movie-details-card.component';
import { CardComponent } from '../components/card/card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieDetailsCardComponent, CardComponent],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  private detailsService = inject(MovieDetailsService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  public tmdbService = inject(TmdbWatchlistService);
  private recService = inject(RecommendationsService);

  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  recommendations = signal<Movie[]>([]);

  movie$: Signal<MovieDetails | null> = toSignal<MovieDetails | null>(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/']);
          return of(null);
        }

        this.loading.set(true);
        this.error.set(null);

        return this.detailsService.loadDetails(id).pipe(
          catchError((err) => {
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

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadRecommendations(id);
    }
  }

  get filledStars(): number {
    return Math.round((this.movie$()?.vote_average ?? 0) / 2);
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  addToWatchlist(id: number) {
    if (!id) {
      console.warn('Missing movie ID');
      return;
    }
    this.tmdbService.addMovieToWatchlist(id)
      .then(() => console.log(`${id} added to watchlist.`))
      .catch(err => console.error('Watchlist error', err));
  }

  loadRecommendations(movieId: number) {
    this.recService.getRecommendations(movieId).subscribe({
      next: (recs) => this.recommendations.set(recs),
      error: (err) => {
        console.error('Failed to load recommendations:', err);
        this.error.set('Failed to load recommendations');
      }
    });
  }

  navigateToMovieDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }
}
