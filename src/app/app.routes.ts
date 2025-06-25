import { Routes } from '@angular/router';
import { MoviesListComponent } from './moviesList/moviesList.component';
import { SearchResultsComponent } from './moviesList/search-results/search-results.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'search', component: SearchResultsComponent },
];
