// src/app/components/language-dropdown/language-dropdown.component.ts
import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../services/language-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent implements OnInit {
  languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];
  currentLang!: Language;

  constructor(private langService: LanguageService) {}

  ngOnInit() {
    this.currentLang = this.langService.getLanguage();
     this.langService.currentLang$.subscribe(lang => this.currentLang = lang);
  }

 changeLanguage(event: Event) {
  const select = event.target as HTMLSelectElement;    
  const langCode = select.value;                        
  const lang = this.languages.find(l => l.code === langCode)!;
  this.langService.setLanguage(lang);
 
}

}
