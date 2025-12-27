import { useState, useRef, useEffect } from 'react';
import { useLanguage, Locale } from '@/lib/language';

export function LanguageSwitcher() {
    const { locale, setLocale, locales, localeShort } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const flags: { [key in Locale]: string } = {
        vi: '🇻🇳',
        en: '🇬🇧',
        ja: '🇯🇵',
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm border-2 transition-all hover:opacity-70"
                style={{ borderColor: 'rgb(var(--color-border))' }}
                aria-label="Switch language"
            >
                <span>{flags[locale]}</span>
                <span className="text-xs font-medium">{localeShort[locale]}</span>
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 py-1 border-2 min-w-[120px] z-50"
                    style={{
                        borderColor: 'rgb(var(--color-border))',
                        backgroundColor: 'rgb(var(--color-bg))'
                    }}
                >
                    {locales.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => {
                                setLocale(loc);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-opacity hover:opacity-70 ${locale === loc ? 'font-semibold' : ''
                                }`}
                            style={{
                                backgroundColor: locale === loc ? 'rgb(var(--color-surface))' : 'transparent'
                            }}
                        >
                            <span>{flags[loc]}</span>
                            <span>{localeShort[loc]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
