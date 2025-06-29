// src/app/services/language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface Language {
  code: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'app_language';

   private langSubject!: BehaviorSubject<Language>;

  currentLang$ = this.langSubject = new BehaviorSubject<Language>(
    this.loadSavedLanguage()
  );

  constructor(private router: Router) {
     this.applyToDocument(this.langSubject.value);
  }

   setLanguage(lang: Language) {
    this.langSubject.next(lang);
    localStorage.setItem(this.storageKey, JSON.stringify(lang));
    this.applyToDocument(lang);

     this.router.navigateByUrl(this.router.url);
  }

   getLanguage(): Language {
    return this.langSubject.value;
  }

   private loadSavedLanguage(): Language {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as Language;
      } catch {
       }
    }
    return { code: 'en', label: 'English' };
  }

   private applyToDocument(lang: Language) {
    document.documentElement.lang = lang.code;
    document.documentElement.dir  = lang.code === 'ar' ? 'rtl' : 'ltr';
  }
}
