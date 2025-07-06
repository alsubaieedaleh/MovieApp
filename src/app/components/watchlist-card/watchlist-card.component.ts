import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() movie!: WatchlistMovie;          
  @Output() favoriteToggled = new EventEmitter<void>();

  isFavorite = false;
@Output() removeFromWatchlist = new EventEmitter<number>();

toggleFavorite() {
  this.removeFromWatchlist.emit(this.movie.id);
}

get filledStars(): number {
    return Math.round(this.movie.rate / 20);
  }

  get starsArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }
}
