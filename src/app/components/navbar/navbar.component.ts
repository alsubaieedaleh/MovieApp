import {
  Component,
  computed,
  inject,
 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/shared/language-service.service';
import { TmdbWatchlistService } from '../../services/shared/watchlist.service';
import { LanguageDropdownComponent } from '../languageDropdown/language-dropdown.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LanguageDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private tmdbWatchlist = inject(TmdbWatchlistService);
  private langService = inject(LanguageService);

   private langCodeSignal = toSignal(
    this.langService.currentLang$.pipe(map(lang => lang.code)),
    { initialValue: this.langService.getLanguage().code }
  );

   currentLangCode = computed(() => this.langCodeSignal());

  watchlistCount = computed(() => this.tmdbWatchlist.watchlistCount());
}
