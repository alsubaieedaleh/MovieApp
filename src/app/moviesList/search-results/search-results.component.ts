// src/app/components/search-results/search-results.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchService } from '../../services/MovieServices/search.service';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { CardComponent } from '../../components/card/card.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CardComponent, CommonModule, SearchBoxComponent, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private searchService = inject(SearchService);
  private watchlistService = inject(TmdbWatchlistService);

  searchResults = signal<Movie[]>([]);
  query = signal<string>('');
   ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const term = params.get('q')?.trim();
      if (term) {
        this.query.set(term);
        this.fetchSearchResults(term);
      }
    });
  }

  fetchSearchResults(term: string) {
    this.searchService.searchMovies(term, 1).subscribe(
      (results) => this.searchResults.set(results),
      (error) => {
        console.error('Search error:', error);
        this.searchResults.set([]);
      }
    );
  }

  onSearch(term: string) {
    this.router.navigate(['/search'], { queryParams: { q: term } });
  }

  addToWatchlist(movie: Movie) {
    if (movie.id == null) return;
    this.watchlistService.addToWatchlist("movie", movie.id, true)
      .then(() => console.log(`${movie.title} added to watchlist.`))
      .catch(err => console.error('Watchlist error', err));
  }

  movies = computed(() => this.searchResults());
}
