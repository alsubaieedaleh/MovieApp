import { Component , input, output } from '@angular/core';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  movie = input.required<Movie>();
  onFavorite = output<void>();

  isFavorite = false;  
constructor(public router: Router) {}
  get strokeColor(): string {
    const rate = this.movie().rate;
    if (rate >= 80) return '#22c55e';
    if (rate >= 50) return '#eab308';
    return '#ef4444';
  }

  get rate(): number {
    return Math.min(Math.max(this.movie().rate, 0), 100);
  }

  handleFavorite() {
    this.isFavorite = !this.isFavorite;  
    this.onFavorite.emit();
  } 
  navigateToDetails() {
    const currentUrl = this.router.url;
    if (currentUrl === '/' || currentUrl === '') {
      this.router.navigate(['/movie', this.movie().id]);
    } else if (currentUrl.includes('tvshow')) {
      this.router.navigate(['/tvshow', this.movie().id]);
    } else {
       this.router.navigate(['/movie', this.movie().id]);
    }
  }
}
