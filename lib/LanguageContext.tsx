import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'vn' | 'en';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    mounted: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'vn',
    setLanguage: () => {},
    mounted: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('vn');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('language');
        if (stored === 'vn' || stored === 'en') {
            setLanguageState(stored);
        }
        setMounted(true);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, mounted }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
