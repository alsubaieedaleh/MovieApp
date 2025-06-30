// src/app/moviesList/tvshows/tvshows.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TVShowsService } from "../services/TVServices/tvshows.service";
import { Movie } from '../models/movie';
import { CardComponent } from '../components/card/card.component';
import { TmdbWatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-tvshows',
  standalone: true,
  imports: [CommonModule, CardComponent,TranslatePipe  ],
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss']
})
export class TVShowsComponent implements OnInit {
  tvShows = signal<Movie[]>([]);
  currentPage = signal(1);

  constructor(
    private tvShowsService: TVShowsService,
    private watchlistService: TmdbWatchlistService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadTVShows(this.currentPage());
  }

  loadTVShows(page: number) {
    this.currentPage.set(page);
    this.tvShowsService.getPopularTVShows(page).subscribe(data => {
      this.tvShows.set(data);
    });
  }

  addToWatchlist(show: Movie) {
    if (!show.id) return;
    this.watchlistService.addToWatchlist(show.id)
      .then(() => console.log(`${show.title} added to watchlist.`))
      .catch(err => console.error('Watchlist error', err));
  }
}
