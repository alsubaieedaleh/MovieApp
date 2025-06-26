import { Routes } from '@angular/router';
import { MoviesListComponent } from './moviesList/moviesList.component';
import { SearchResultsComponent } from './moviesList/search-results/search-results.component';
import { WatchListComponent } from './moviesList/wishlist/watchList.component';
import { MovieDetailsComponent } from './moviesList/movie-details/movie-details.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'search', component: SearchResultsComponent },
    { path: 'watchlist', component: WatchListComponent },  
      { path: 'movie/:id', component: MovieDetailsComponent },


];
