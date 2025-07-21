import {
  Component,
  input,
  output,
  signal,
  computed,
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

   movie = input<MovieDetails | null>(null);
  favoriteToggled = output<number>();
 
   filledStars = computed(() =>
    this.movie() ? Math.round(this.movie()!.vote_average / 2) : 0
  );

  starsArray = computed(() => Array(5).fill(0).map((_, i) => i));

   toggleFavorite() {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.favoriteToggled.emit(currentMovie.id);
    }
  }
}
