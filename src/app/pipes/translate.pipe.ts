// src/app/pipes/translate.pipe.ts
import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from "../services/language-service.service"; 

const TRANSLATIONS: Record<string, any> = {
  en: {
    welcomeTitle: 'Welcome to our movie app',
    welcomeSubtitle: 'Millions of movies, TV shows and people to discover. Explore now.',
    searchPlaceholder: 'Search for movies',
    nowPlaying: 'Now Playing',
    searchBtn: 'Search',
    popularTVShows: 'Popular TV Shows',
    WATCHLIST: {
      TITLE: 'Watchlist',
      LOADING: 'Loading...',
      EMPTY: 'No items in your watchlist',
      BACK_HOME: 'Back to Home',
    }
  },
  ar: {
    welcomeTitle: 'مرحباً بك في تطبيق الأفلام',
    welcomeSubtitle: 'ملايين الأفلام والمسلسلات والأشخاص لاكتشافها. استكشف الآن.',
    searchPlaceholder: 'ابحث عن الأفلام',
    nowPlaying: 'يعرض الآن',
    searchBtn: 'ابحث',
    popularTVShows: 'المسلسلات التلفزيونية الشهيرة',
    WATCHLIST: {
      TITLE: 'قائمة المشاهدة',
      LOADING: 'جارٍ التحميل...',
      EMPTY: 'لا توجد عناصر في قائمة المشاهدة',
      BACK_HOME: 'العودة إلى الصفحة الرئيسية',
    }
  },
  fr: {
    welcomeTitle: 'Bienvenue sur notre application de films',
    welcomeSubtitle: "Des millions de films, séries et personnes à découvrir. Explorez maintenant.",
    searchPlaceholder: 'Rechercher des films',
    nowPlaying: 'À l\'affiche',
    searchBtn: 'Recherche',
    popularTVShows: 'Séries TV Populaires',
    WATCHLIST: {
      TITLE: 'Liste de surveillance',
      LOADING: 'Chargement...',
      EMPTY: 'Aucun élément dans votre liste de surveillance',
      BACK_HOME: 'Retour à l\'accueil',
    }
  },
  zh: {
    welcomeTitle: '欢迎来到我们的电影应用',
    welcomeSubtitle: '数百万电影、电视剧和人物供您探索。立即开始。',
    searchPlaceholder: '搜索电影',
    nowPlaying: '热映中',
    searchBtn: '搜索',
    popularTVShows: '热门电视剧',
    WATCHLIST: {
      TITLE: '观看列表',
      LOADING: '加载中...',
      EMPTY: '观看列表中没有项目',
      BACK_HOME: '返回首页',
    }
  }
};

@Pipe({ name: 'translate', standalone: true })

export class TranslatePipe implements PipeTransform {
  langService= inject(LanguageService);
 
  transform(key: string): string {
    const langCode = this.langService.getLanguage().code;
    const translationTree = TRANSLATIONS[langCode] || {};
    // support nested keys, e.g. 'WATCHLIST.TITLE'
    const parts = key.split('.');
    let result  = translationTree;
    for (const part of parts) {
      result = result ? result[part] : undefined;
    }
    return result ?? key;
  }
}
