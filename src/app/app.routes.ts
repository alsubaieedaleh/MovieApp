import { Routes } from '@angular/router';
 

export const routes: Routes = [
  { path: '', loadChildren: () => import('./moviesList/moviesList.module.route').then(m => m.routes) },
  { path: 'search', loadChildren: () => import('./search-results/search-results.module.route').then(m => m.routes) },
  { path: 'watchlist', loadChildren: () => import('./wishlist/watchList.module.route').then(m => m.routes) },
  { path: 'movie/:id', loadChildren: () => import('./movie-details/movie-details.module.route').then(m => m.routes) },
  { path: 'tvshows', loadChildren: () => import('./tvshows/tvshows.module.route').then(m => m.routes) },
  { path: 'tvshow/:id', loadChildren: () => import('./tvshows-details/tvshows-details.module.route').then(m => m.routes) }, 

];
