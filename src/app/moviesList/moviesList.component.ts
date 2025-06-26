// src/app/components/movies-list/movies-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { Movie } from '../models/movie';
import { MoviesListService } from '../services/MovieServices/movies-list.service';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { SearchService } from '../services/MovieServices/search.service';
import { CardComponent } from '../components/card/card.component';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results/search-results.component';
import { Router } from '@angular/router';
import { SearchBoxComponent } from '../components/search-box/search-box.component';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CardComponent, CommonModule,SearchResultsComponent,SearchBoxComponent], // CardComponent is in template via selector
  templateUrl: './moviesList.component.html',
  styleUrls: ['./moviesList.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies = signal<Movie[]>([]);
  currentPage = signal<number>(1); 

  // For search
  searchTerm = signal<string>('');
searchResults = signal<Movie[] | undefined>(undefined);
  searchPage = signal<number>(1);

  constructor(
    private moviesService: MoviesListService,
    private tmdbService: TmdbWatchlistService,
    private searchService: SearchService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Initially load now-playing
    this.loadMovies(this.currentPage());
  }

  loadMovies(page: number) {
    this.currentPage.set(page);
    this.searchResults.set(undefined); // clear any search
    const minDate = '2023-01-01';
    const maxDate = '2025-12-31';

    this.moviesService.getMovies(page, minDate, maxDate)
      .subscribe(data => this.movies.set(data));
  }
goToSearch() {
  const q = this.searchTerm().trim();
  if (!q) return;
  this.router.navigate(['/search'], { queryParams: { q } });
}
  onSearch() {
    const q = this.searchTerm().trim();
    if (!q) {
      // empty: clear results and reload now-playing
      this.searchResults.set(undefined);
      this.loadMovies(1);
      return;
    }
    this.searchPage.set(1);
    this.searchResults.set([]); // optionally clear UI or show loading state
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
    this.searchResults.set([]); // clear or show loading
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
    this.tmdbService.addToWatchlist(movie.id)
      .then(() => console.log(`${movie.title} added to watchlist.`))
      .catch(err => console.error('Watchlist error', err));
  }
}
