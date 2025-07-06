import { Component, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TVShowsDetailsService } from '../../services/TVServices/tvshows-details.service';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { MovieDetails } from '../../models/movieDetails';
import { MovieDetailsCardComponent } from '../../components/movie-details-card/movie-details-card.component';
import { CardComponent } from '../../components/card/card.component';
import { TVRecommendationsService } from '../../services/TVServices/recommendations.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-tvshows-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MovieDetailsCardComponent,
    CardComponent
  ],
  templateUrl: './tvshows-details.component.html',
  styleUrls: ['./tvshows-details.component.scss']
})
export class TVShowsDetailsComponent {
  tvShow$: Signal<MovieDetails | null> = this.detailsService.tvShow;
  recommendations: Signal<Movie[]> = this.recommendationsService.recommendations;

  constructor(
    private detailsService: TVShowsDetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbWatchlistService,
    private recommendationsService: TVRecommendationsService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.detailsService.loadTVShowDetails(id);
      this.recommendationsService.loadTVRecommendations(id);
    } else {
      this.router.navigate(['/tv-shows']);
    }
  }

  addToWatchlist(id: number) {
    if (!id) return;
    this.tmdbService.addTVToWatchlist( id )
      .then(() => console.log(`${id} added to watchlist.`))
      .catch(err => console.error('Watchlist error', err));
  }

  navigateToTVShowDetails(id: number) {
    this.router.navigate(['/tvshow', id]);
    this.detailsService.loadTVShowDetails(id);
    this.recommendationsService.loadTVRecommendations(id);
  }
}
