import {
  Component,
  input,
  output,
   inject,
   
} from '@angular/core';
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
  router = inject(Router);

  // ✅ Signal Input
  movie = input<MovieDetails | null>(null);

  // ✅ Signal Outputs
  favoriteToggled = output<number>();
  back = output<void>();

  toggleFavorite() {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.favoriteToggled.emit(currentMovie.id);
    }
  }

  goBack() {
    this.back.emit();
  }

  get filledStars(): number {
    return this.movie() ? Math.round(this.movie()!.vote_average / 2) : 0;
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
}
