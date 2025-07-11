import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, startWith } from 'rxjs';

import { SearchService } from '../services/MovieServices/search.service';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { CardComponent } from '../components/card/card.component';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CardComponent, CommonModule, SearchBoxComponent, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  searchService = inject(SearchService);
  watchlistService = inject(TmdbWatchlistService);

  query = toSignal<string>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q')?.trim() ?? ''),
      startWith('')
    )
  );

  searchResults = toSignal<Movie[]>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q')?.trim() ?? ''),
      switchMap((term) =>
        term ? this.searchService.searchMovies(term, 1) : of([] as Movie[])
      ),
      catchError((err) => {
        console.error('Search error:', err);
        return of([] as Movie[]);
      }),
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
      .then(() => console.log(`${movie.title} added to watchlist.`))
      .catch((err) => console.error('Watchlist error', err));
  }
}
