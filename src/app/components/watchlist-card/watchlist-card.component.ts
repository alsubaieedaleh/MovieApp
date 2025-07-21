import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistMovie } from '../../models/watchlist-movie';
import {TruncatePipe} from "../../pipes/truncate.pipe";
@Component({
  selector: 'app-watchlist-card',
  standalone: true,
  imports: [CommonModule , TruncatePipe],
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss'],
})
export class WatchlistCardComponent {
   movie = input<WatchlistMovie>();

   favoriteToggled = output<void>();
  removeFromWatchlist = output<number>();

  isFavorite = signal<boolean>(false);

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
