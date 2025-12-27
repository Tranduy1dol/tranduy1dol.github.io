import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'vi' | 'en' | 'ja';

type Translations = {
    [key: string]: string;
};

type LocaleData = {
    [locale in Locale]: Translations;
};

// Translation data
const translations: LocaleData = {
    vi: {
        // Header
        'nav.home': 'Trang chủ',
        'nav.about': 'Giới thiệu',
        'nav.blog': 'Blog',
        'nav.book': 'Sách',

        // Hero
        'hero.title': 'Code Alchemist.',
        'hero.greeting': 'Xin chào, tôi là',
        'hero.description': '— biến ý tưởng thành Rust APIs hiệu suất cao, hệ thống phân tán, và ma thuật Zero-Knowledge.',
        'hero.readBlog': 'Đọc Blog',
        'hero.viewCV': 'Xem CV',
        'hero.aboutMe': 'Về Tôi',

        // About
        'about.role': 'Code Alchemist',
        'about.tagline': 'Biến ý tưởng thành Rust APIs & ma thuật ZK. Tại Hà Nội, Việt Nam 🇻🇳',

        // Footer
        'footer.navigate': 'Điều hướng',
        'footer.connect': 'Kết nối',
        'footer.rights': 'Bản quyền thuộc về',
        'footer.tagline': 'Code Alchemist — biến ý tưởng thành Rust APIs & ma thuật ZK. Tại Hà Nội, Việt Nam 🇻🇳',

        // Common
        'common.backToPosts': 'Quay lại bài viết',
        'common.viewAll': 'Xem tất cả',
        'common.readMore': 'Đọc thêm',
    },
    en: {
        // Header
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.blog': 'Blog',
        'nav.book': 'Book',

        // Hero
        'hero.title': 'Code Alchemist.',
        'hero.greeting': "Hello, I'm",
        'hero.description': '— transmuting ideas into high-performance Rust APIs, distributed systems, and Zero-Knowledge sorcery.',
        'hero.readBlog': 'Read Blog',
        'hero.viewCV': 'View CV',
        'hero.aboutMe': 'About Me',

        // About
        'about.role': 'Code Alchemist',
        'about.tagline': 'Transmuting ideas into Rust APIs & ZK sorcery. Based in Hanoi, Vietnam 🇻🇳',

        // Footer
        'footer.navigate': 'Navigate',
        'footer.connect': 'Connect',
        'footer.rights': 'All rights reserved',
        'footer.tagline': 'Code Alchemist — transmuting ideas into Rust APIs & ZK sorcery. Based in Hanoi, Vietnam 🇻🇳',

        // Common
        'common.backToPosts': 'Back to all posts',
        'common.viewAll': 'View all',
        'common.readMore': 'Read more',
    },
    ja: {
        // Header
        'nav.home': 'ホーム',
        'nav.about': '紹介',
        'nav.blog': 'ブログ',
        'nav.book': '本',

        // Hero
        'hero.title': 'Code Alchemist.',
        'hero.greeting': 'こんにちは、私は',
        'hero.description': '— アイデアを高性能なRust API、分散システム、そしてゼロ知識証明の魔法に変換します。',
        'hero.readBlog': 'ブログを読む',
        'hero.viewCV': '履歴書を見る',
        'hero.aboutMe': '私について',

        // About
        'about.role': 'コード・アルケミスト',
        'about.tagline': 'アイデアをRust APIとZK魔法に変換。ベトナム・ハノイ在住 🇻🇳',

        // Footer
        'footer.navigate': 'ナビゲーション',
        'footer.connect': '連絡先',
        'footer.rights': '著作権所有',
        'footer.tagline': 'Code Alchemist — アイデアをRust APIとZK魔法に変換。ベトナム・ハノイ在住 🇻🇳',

        // Common
        'common.backToPosts': '記事一覧に戻る',
        'common.viewAll': 'すべて見る',
        'common.readMore': '続きを読む',
    },
};

const localeNames: { [key in Locale]: string } = {
    vi: '🇻🇳 Tiếng Việt',
    en: '🇬🇧 English',
    ja: '🇯🇵 日本語',
};

const localeShort: { [key in Locale]: string } = {
    vi: 'VI',
    en: 'EN',
    ja: 'JA',
};

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    locales: Locale[];
    localeNames: typeof localeNames;
    localeShort: typeof localeShort;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('vi');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('locale') as Locale | null;
        if (saved && ['vi', 'en', 'ja'].includes(saved)) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (key: string): string => {
        return translations[locale][key] || translations['en'][key] || key;
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <LanguageContext.Provider
            value={{
                locale,
                setLocale,
                t,
                locales: ['vi', 'en', 'ja'],
                localeNames,
                localeShort,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    // Return default values during SSG/SSR when not wrapped in provider
    if (!context) {
        return {
            locale: 'vi',
            setLocale: () => { },
            t: (key: string) => translations['vi'][key] || translations['en'][key] || key,
            locales: ['vi', 'en', 'ja'],
            localeNames,
            localeShort,
        };
    }
    return context;
}
