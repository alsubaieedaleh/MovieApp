import { Component } from '@angular/core';
import { LanguageDropdownComponent } from '../languageDropdown/language-dropdown.component';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LanguageDropdownComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
constructor(public tmdbWatchlist: TmdbWatchlistService) {}

}
