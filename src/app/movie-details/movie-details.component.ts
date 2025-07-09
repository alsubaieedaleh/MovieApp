 
import { Component, Signal, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieDetailsService } from '../services/MovieServices/movie-details.service';
import { MovieDetails } from '../models/movieDetails';
import { MovieDetailsCardComponent } from '../components/movie-details-card/movie-details-card.component';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { RecommendationsService } from '../services/MovieServices/recommendations.service';
import { Movie } from '../models/movie';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieDetailsCardComponent, CardComponent, ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  movie$: Signal<MovieDetails | null> = this.details.movie;
  loading$: Signal<boolean> = this.details.loading;

  recommendations = signal<Movie[]>([]);

  constructor(
    private details: MovieDetailsService,
    private route: ActivatedRoute,
    public router: Router,
    public tmdbService: TmdbWatchlistService,
    private recService: RecommendationsService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.details.loadDetails(id);
      this.loadRecommendations(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  get filledStars(): number {
    return Math.round((this.movie$()?.vote_average ?? 0) / 2);
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  addToWatchlist(id: number) {
    if (id == null) {
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
      error: (err) => console.error('Failed to load recommendations:', err)
    });
  }

  navigateToMovieDetails(id: number) {
    this.router.navigate(['/movies', id]);
     this.details.loadDetails(id);
    this.loadRecommendations(id);
  }
}
