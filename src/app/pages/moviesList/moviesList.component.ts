import { Component, inject, signal, computed } from '@angular/core';
import { Movie } from '../../models/movie';
import { TmdbWatchlistService } from '../../services/shared/watchlist.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../../components/loading/loading.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, startWith } from 'rxjs';
import { MovieServices } from '../../services/movie-services';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './moviesList.component.html',
  styleUrls: ['./moviesList.component.scss'],
})
export class MoviesListComponent {
  private moviesServices = inject(MovieServices);
  private tmdbService = inject(TmdbWatchlistService);
  public router = inject(Router);

  // 🔄 Use shared favoriteMovieMap signal
  favoriteMap = this.tmdbService.favoriteMovieMap;

  currentPage = signal<number>(1);
  searchTerm = signal<string>('');
  searchPage = signal<number>(1);

  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  movies = toSignal<Movie[]>(
    toObservable(this.currentPage).pipe(
      switchMap((page) => {
        this.loading.set(true);
        this.error.set(null);
        return this.moviesServices
          .getMovies(page, '2023-01-01', '2025-12-31')
          .pipe(
            catchError((err) => {
              console.error('Movie list error', err);
              this.error.set('Failed to load movies');
              return of([] as Movie[]);
            }),
            finalize(() => this.loading.set(false))
          );
      }),
      startWith([] as Movie[])
    )
  );

  searchResults = toSignal<Movie[] | null>(
    toObservable(
      computed(() => {
        const q = this.searchTerm().trim();
        const page = this.searchPage();
        return q ? { q, page } : null;
      })
    ).pipe(
      switchMap((params) => {
        if (!params) return of(null);

        this.loading.set(true);
        this.error.set(null);

        return this.moviesServices.searchMovies(params.q, params.page).pipe(
          catchError((err) => {
            console.error('Search error', err);
            this.error.set('Search failed');
            return of([] as Movie[]);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    ),
    { initialValue: null }
  );

  onSearch(query: string) {
    const q = query.trim();
    if (!q) return;

    this.searchTerm.set(q);
    this.searchPage.set(1);
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  loadSearchPage(page: number) {
    if (this.searchTerm().trim()) {
      this.searchPage.set(page);
    }
  }

  addToWatchlist(movie: Movie) {
    if (!movie?.id) return;

    const isFav = this.favoriteMap()[movie.id] || false;

    // Optimistic UI update
    this.tmdbService.favoriteMovieMap.update((map) => ({
      ...map,
      [movie.id]: !isFav,
    }));

    const action = isFav
      ? this.tmdbService.removeMovieFromWatchlist(movie.id)
      : this.tmdbService.addMovieToWatchlist(movie.id);

    action.catch((err) => {
      console.error('Watchlist toggle error', err);
      // Revert if error
      this.tmdbService.favoriteMovieMap.update((map) => ({
        ...map,
        [movie.id]: isFav,
      }));
    });
  }
}
