import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TVShowsService } from '../../services/TVServices/tvshows.service';
import { Movie } from '../../models/movie';
import { CardComponent } from '../../components/card/card.component';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LoadingSpinnerComponent } from '../../components/loading/loading.component';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, finalize, of, startWith } from 'rxjs';

@Component({
  selector: 'app-tvshows',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TranslatePipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './tvshows.component.html',
  styleUrls: ['./tvshows.component.scss'],
})
export class TVShowsComponent {
  private tvShowsService    = inject(TVShowsService);
  private watchlistService  = inject(TmdbWatchlistService);
  public  router            = inject(Router);

   currentPage = signal<number>(1);

   loading = signal<boolean>(false);

   tvShows = toSignal<Movie[]>(
    toObservable(this.currentPage).pipe(
       startWith(this.currentPage()),

       switchMap(page => {
        this.loading.set(true);
        return this.tvShowsService.getPopularTVShows(page).pipe(
          catchError(err => {
            console.error('Failed to load TV shows', err);
            return of([] as Movie[]);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    )
  );

   movies = () => this.tvShows();

   loadTVShows(page: number) {
    this.currentPage.set(page);
  }

   addToWatchlist(show: Movie) {
    if (!show.id) {
      console.error('Show ID is missing');
      return;
    }
    this.watchlistService
      .addTVToWatchlist(show.id)
       .catch(err => console.error('Watchlist error', err));
  }
}
