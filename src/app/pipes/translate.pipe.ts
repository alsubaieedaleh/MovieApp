// src/app/pipes/translate.pipe.ts
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language-service.service';
import { Subscription } from 'rxjs';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    welcomeTitle: 'Welcome to our movie app',
    welcomeSubtitle: 'Millions of movies, TV shows and people to discover. Explore now.',
    searchPlaceholder: 'Search for movies',
    nowPlaying: 'Now Playing',
    searchBtn: 'Search',
    popularTVShows: 'Popular TV Shows',

  },
  ar: {
    welcomeTitle: 'مرحباً بك في تطبيق الأفلام',
    welcomeSubtitle: 'ملايين الأفلام والمسلسلات والأشخاص لاكتشافها. استكشف الآن.',
    searchPlaceholder: 'ابحث عن الأفلام',
    nowPlaying: 'يعرض الآن',
    searchBtn: 'ابحث',
    popularTVShows: 'المسلسلات التلفزيونية الشهيرة',

  },
  fr: {
    welcomeTitle: 'Bienvenue sur notre application de films',
    welcomeSubtitle: 'Des millions de films, séries et personnes à découvrir. Explorez maintenant.',
    searchPlaceholder: 'Rechercher des films',
    nowPlaying: 'À l\'affiche',
    searchBtn: 'Recherche',
    popularTVShows: 'Séries TV Populaires',

  },
  zh: {
    welcomeTitle: '欢迎来到我们的电影应用',
    welcomeSubtitle: '数百万电影、电视剧和人物供您探索。立即开始。',
    searchPlaceholder: '搜索电影',
    nowPlaying: '热映中',
    searchBtn: '搜索',
    popularTVShows: '热门电视剧',

  }
};
 
@Pipe({ name: 'translate', standalone: true })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private langCode = this.langService.getLanguage().code;
  private sub: Subscription;

  constructor(private langService: LanguageService) {
    this.sub = this.langService.currentLang$.subscribe(lang => {
      this.langCode = lang.code;
    });
  }

  transform(key: string): string {
    return (TRANSLATIONS[this.langCode] && TRANSLATIONS[this.langCode][key]) 
      || key;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
