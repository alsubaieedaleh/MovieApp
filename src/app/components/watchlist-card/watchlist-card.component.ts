import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistMovie } from '../../models/watchlist-movie';

@Component({
  selector: 'app-watchlist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss'],
})
export class WatchlistCardComponent {
   movie = input<WatchlistMovie>();

   favoriteToggled = output<void>();
  removeFromWatchlist = output<number>();

  isFavorite = false;

  toggleFavorite() {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.removeFromWatchlist.emit(currentMovie.id);
    }
  }

  get filledStars(): number {
    const m = this.movie();
    return m ? Math.round(m.rate / 20) : 0;
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
}
