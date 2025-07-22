 import { Injectable, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface Language { code: string; label: string; }

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly key = 'app_language';
  private langSubject = new BehaviorSubject<Language>(this.load());

   currentLang$ = this.langSubject.asObservable();

   currentLang = toSignal(this.currentLang$, { initialValue: this.load() });

  private router = inject(Router);

  constructor() {
     effect(() => this.apply(this.currentLang()));
     this.apply(this.currentLang());
  }

  setLanguage(lang: Language) {
    this.langSubject.next(lang);
    localStorage.setItem(this.key, JSON.stringify(lang));
    this.router.navigateByUrl(this.router.url);
  }

  getLanguage(): Language {
    return this.currentLang();
  }

  private load(): Language {
    const saved = localStorage.getItem(this.key);
    return saved ? (JSON.parse(saved) as Language) : { code: 'en', label: 'English' };
  }

  private apply(lang: Language) {
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr';
  }
}
