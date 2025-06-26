import { Routes } from '@angular/router';
import { MoviesListComponent } from './moviesList/moviesList.component';
import { SearchResultsComponent } from './moviesList/search-results/search-results.component';
import { WatchListComponent } from './moviesList/wishlist/watchList.component';
import { MovieDetailsComponent } from './moviesList/movie-details/movie-details.component';
import { TVShowsComponent } from './tvshows/tvshows.component';
import { TVShowsDetailsComponent } from './tvshows/tvshows-details/tvshows-details.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'search', component: SearchResultsComponent },
    { path: 'watchlist', component: WatchListComponent },  
      { path: 'movie/:id', component: MovieDetailsComponent },
      { path: 'tvshows', component: TVShowsComponent },
      { path: 'tvshow/:id', component: TVShowsDetailsComponent },

];
