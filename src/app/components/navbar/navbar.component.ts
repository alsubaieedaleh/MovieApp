// src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language-service.service';
import { TmdbWatchlistService } from '../../services/watchlist.service';
import { LanguageDropdownComponent } from '../languageDropdown/language-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, LanguageDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  currentLangCode!: string;

  constructor(
    public tmdbWatchlist: TmdbWatchlistService,
    private langService: LanguageService
  ) {}

  ngOnInit() {
     this.langService.currentLang$.subscribe(lang => {
      this.currentLangCode = lang.code;
     });
  }
}
