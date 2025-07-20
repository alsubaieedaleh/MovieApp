import { Component, inject, OnInit, signal } from '@angular/core';
import { Language, LanguageService } from '../../services/language-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent  {
  languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];
   langService = inject(LanguageService);
   currentLang = toSignal(
    this.langService.currentLang$, 
    { initialValue: this.langService.getLanguage() }
  );

 
  selectedCode = signal(this.currentLang().code);

  changeLanguage(code: string) {
    const lang = this.languages.find(l => l.code === code)!;
    this.langService.setLanguage(lang);
    // selectedCode updates automatically via signal
    this.selectedCode.set(code);
  }

}
