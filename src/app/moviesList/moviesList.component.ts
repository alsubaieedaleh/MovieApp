import { Component, OnInit, signal, inject } from '@angular/core';
import { Movie } from '../models/movie';
import { MoviesListService } from '../services/MovieServices/movies-list.service';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { SearchService } from '../services/MovieServices/search.service';
import { CardComponent } from '../components/card/card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../components/loading/loading.component';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CardComponent, CommonModule, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './moviesList.component.html',
  styleUrls: ['./moviesList.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies = signal<Movie[]>([]);
  currentPage = signal<number>(1);
  loading = signal(true);

  searchTerm = signal<string>('');
  searchResults = signal<Movie[] | undefined>(undefined);
  searchPage = signal<number>(1);

  private moviesService = inject(MoviesListService);
  private tmdbService = inject(TmdbWatchlistService);
  private searchService = inject(SearchService);
  public router = inject(Router);

  ngOnInit(): void {
    this.loadMovies(this.currentPage());
  }

  loadMovies(page: number) {
    this.loading.set(true);

    this.currentPage.set(page);
    this.searchResults.set(undefined);
    const minDate = '2023-01-01';
    const maxDate = '2025-12-31';

    this.moviesService
      .getMovies(page, minDate, maxDate)
      .subscribe({
        next: data => this.movies.set(data),
        complete: () => this.loading.set(false),
        error: () => this.loading.set(false)
      });
  }

  goToSearch() {
    const q = this.searchTerm().trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  onSearch() {
    const q = this.searchTerm().trim();
    if (!q) {
      this.searchResults.set(undefined);
      this.loadMovies(1);
      return;
    }
    this.searchPage.set(1);
    this.searchResults.set([]);
    this.searchService.searchMovies(q, this.searchPage()).subscribe(
      (results: Movie[]) => {
        this.searchResults.set(results);
      },
      (err: unknown) => {
        console.error('Search error', err);
        this.searchResults.set([]);
      }
    );
  }

  loadSearchPage(page: number) {
    const q = this.searchTerm().trim();
    if (!q) return;
    this.searchPage.set(page);
    this.searchResults.set([]);
    this.searchService.searchMovies(q, page).subscribe(
      (results: Movie[]) => {
        this.searchResults.set(results);
      },
      (err: unknown) => {
        console.error('Search page error', err);
        this.searchResults.set([]);
      }
    );
  }

  addToWatchlist(movie: Movie) {
    if (movie.id == null) {
      console.warn('Missing movie ID');
      return;
    }
    this.tmdbService
      .addMovieToWatchlist(movie.id)
      .then(() => console.log(`${movie.title} added to watchlist.`))
      .catch((err) => console.error('Watchlist error', err));
  }
}
