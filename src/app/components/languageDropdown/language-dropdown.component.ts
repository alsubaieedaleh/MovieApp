import { Component, Inject } from '@angular/core';
import { LanguageService } from '../../services/language-service.service';

@Component({
  selector: 'app-language-dropdown',
  standalone: true,
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent {
  languages = ['En', 'Ar', 'Fr', 'Zh'];
  currentLang = this.langService.getLanguage();

  constructor(@Inject(LanguageService) private langService: LanguageService) {}

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target !== null) {
      this.langService.setLanguage(target.value);
    }
  }
}
