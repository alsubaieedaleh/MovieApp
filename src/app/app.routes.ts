import { Routes } from '@angular/router';
 

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/moviesList/moviesList.module.route').then(m => m.routes) },
  { path: 'search', loadChildren: () => import('./pages/search-results/search-results.module.route').then(m => m.routes) },
  { path: 'watchlist', loadChildren: () => import('./pages/wishlist/watchList.module.route').then(m => m.routes) },
  { path: 'movie/:id', loadChildren: () => import('./pages/movie-details/movie-details.module.route').then(m => m.routes) },
  { path: 'tvshows', loadChildren: () => import('./pages/tvshows/tvshows.module.route').then(m => m.routes) },
  { path: 'tvshow/:id', loadChildren: () => import('./pages/tvshows-details/tvshows-details.module.route').then(m => m.routes) }, 

];
