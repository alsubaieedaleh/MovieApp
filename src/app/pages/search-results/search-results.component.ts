import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, startWith, tap } from 'rxjs';
import { MovieServices } from '../../services/movie-services';
import { TmdbWatchlistService } from '../../services/shared/watchlist.service';
import { CardComponent } from '../../components/card/card.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie';
import { LoadingSpinnerComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    SearchBoxComponent,
    RouterModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  moviesServices = inject(MovieServices);
  watchlistService = inject(TmdbWatchlistService);
  readonly loading = signal(false);

  query = toSignal<string>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q')?.trim() ?? ''),
      startWith('')
    )
  );

  searchResults = toSignal<Movie[]>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q')?.trim() ?? ''),
      tap(() => this.loading.set(true)),

      switchMap((term) =>
        term ? this.moviesServices.searchMovies(term, 1) : of([] as Movie[])
      ),
      catchError((err) => {
        console.error('Search error:', err);
        return of([] as Movie[]);
      }),
      tap(() => this.loading.set(false)),

      startWith([] as Movie[])
    )
  );

  movies = computed(() => this.searchResults());

  onSearch(term: string) {
    this.router.navigate(['/search'], { queryParams: { q: term } });
  }

  addToWatchlist(movie: Movie) {
    if (movie.id == null) return;
    this.watchlistService
      .addMovieToWatchlist(movie.id)
      .catch((err) => console.error('Watchlist error', err));
  }
}
