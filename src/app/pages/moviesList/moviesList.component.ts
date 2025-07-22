import { Component, inject, signal, computed } from '@angular/core';
import { Movie } from '../../models/movie';
import { MoviesListService } from '../../services/MovieServices/movies-list.service';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { SearchService } from '../../services/MovieServices/search.service';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../../components/loading/loading.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap ,startWith} from 'rxjs';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CardComponent, CommonModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './moviesList.component.html',
  styleUrls: ['./moviesList.component.scss'],
})
export class MoviesListComponent {
  private moviesService = inject(MoviesListService);
  private tmdbService = inject(TmdbWatchlistService);
  private searchService = inject(SearchService);
  public router = inject(Router);
  favoriteMap = signal<Record<number, boolean>>({});

   currentPage = signal<number>(1);
  searchTerm = signal<string>('');
  searchPage = signal<number>(1);

    error = signal<string | null>(null);
  loading = signal<boolean>(false);

  movies = toSignal<Movie[]>(
  toObservable(this.currentPage).pipe(
    switchMap(page => {
      this.loading.set(true);
      this.error.set(null);
      return this.moviesService
        .getMovies(page, '2023-01-01', '2025-12-31')
        .pipe(
          catchError(err => {
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
  toObservable(computed(() => {
    const q = this.searchTerm().trim();
    const page = this.searchPage();
    return q ? { q, page } : null;
  })).pipe(
    switchMap(params => {
      if (!params) return of(null);

      this.loading.set(true);
      this.error.set(null);

      return this.searchService.searchMovies(params.q, params.page).pipe(
        catchError(err => {
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


   onSearch() {
    const q = this.searchTerm().trim();
    this.searchTerm.set(q);
    this.searchPage.set(1);
  }

  loadSearchPage(page: number) {
    if (this.searchTerm().trim()) {
      this.searchPage.set(page);
    }
  }

  addToWatchlist(movie: Movie) {
    if (!movie?.id) {
    console.warn('Missing movie ID');
    return;
  }

  const current = this.favoriteMap()[movie.id] || false;
  this.favoriteMap.update(map => ({
    ...map,
    [movie.id]: !current
  }));

  const action = current
    ? this.tmdbService.removeMovieFromWatchlist(movie.id)
    : this.tmdbService.addMovieToWatchlist(movie.id);

  action.catch(err => {
    console.error('Watchlist toggle error', err);
     this.favoriteMap.update(map => ({
      ...map,
      [movie.id]: current
    }));
  });
  }

  goToSearch() {
    const q = this.searchTerm().trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}
