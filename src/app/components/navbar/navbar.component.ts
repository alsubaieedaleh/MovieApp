import { Component } from '@angular/core';
import { LanguageDropdownComponent } from '../languageDropdown/language-dropdown.component';
import { TmdbWatchlistService } from '../../services/watchlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LanguageDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
constructor(public tmdbWatchlist: TmdbWatchlistService) {}

}
