import { Routes } from '@angular/router';
 

export const routes: Routes = [
  { path: '', loadChildren: () => import('./moviesList/moviesList.component').then(m => m.MoviesListComponent) },
  { path: 'search', loadChildren: () => import('./search-results/search-results.component').then(m => m.SearchResultsComponent) },
  { path: 'watchlist', loadChildren: () => import('./wishlist/watchList.component').then(m => m.WatchListComponent) },
  { path: 'movie/:id', loadChildren: () => import('./movie-details/movie-details.component').then(m => m.MovieDetailsComponent) },
  { path: 'tvshows', loadChildren: () => import('./tvshows/tvshows.component').then(m => m.TVShowsComponent) },
  { path: 'tvshow/:id', loadChildren: () => import('./tvshows-details/tvshows-details.component').then(m => m.TVShowsDetailsComponent) },

];
