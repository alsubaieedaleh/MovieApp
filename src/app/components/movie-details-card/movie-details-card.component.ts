import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetails } from '../../models/movieDetails';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-details-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details-card.component.html',
  styleUrls: ['./movie-details-card.component.scss'],
})
export class MovieDetailsCardComponent {
  constructor(public router: Router) {}
  /** MovieDetails object from TMDB (nullable until loaded) */
  @Input() movie: MovieDetails | null = null;

  /** Emits the movie ID when user toggles favorite */
  @Output() favoriteToggled = new EventEmitter<number>();

  /** Emits when user clicks “back” */
  @Output() back = new EventEmitter<void>();

  toggleFavorite() {
    if (this.movie) {
      this.favoriteToggled.emit(this.movie.id);
    }
  }

  goBack() {
    this.back.emit();
  }

  get filledStars(): number {
    return this.movie ? Math.round(this.movie.vote_average / 2) : 0;
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
}
