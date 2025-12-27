import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Typewriter } from './Typewriter';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/lib/language';
import { LuCake } from 'react-icons/lu';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const { t } = useLanguage();

    const navItems = [
        { href: '/', labelKey: 'nav.home' },
        { href: '/about', labelKey: 'nav.about' },
        { href: '/blog', labelKey: 'nav.blog' },
        { href: '/book', labelKey: 'nav.book' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return router.pathname === '/';
        return router.pathname.startsWith(path);
    };

    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).toUpperCase();

    // Check if today is birthday (December 27th)
    const isBirthday = now.getMonth() === 11 && now.getDate() === 27;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-bg))', color: 'rgb(var(--color-text))' }}>
            {/* Header */}
            <header className="border-b-2 py-8 mb-16" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-baseline justify-between mb-6">
                        <h1 className="text-5xl md:text-6xl">
                            <Link href="/" className="no-underline hover:opacity-70 transition-opacity">
                                {mounted ? <Typewriter texts={["Hi, I'm Tranduy1dol", "Welcome to my blog"]} speed={80} /> : "Hi, I'm Tranduy1dol"}
                            </Link>
                        </h1>
                        <div className="flex items-center gap-4">
                            <time className="text-sm inline-flex items-center gap-2" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                {isBirthday && (
                                    <LuCake
                                        className="w-5 h-5"
                                        title="It's my birthday!"
                                    />
                                )}
                                {currentDate}
                            </time>
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 hover:opacity-70 transition-opacity"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" />
                                            <line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" />
                                            <line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                            <LanguageSwitcher />
                        </div>
                    </div>
                    <nav className="flex gap-8">
                        {navItems.map((item) => (
                            <h4 key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`no-underline hover:opacity-60 transition-opacity ${isActive(item.href) ? 'opacity-100' : 'opacity-70'
                                        }`}
                                >
                                    {t(item.labelKey)}
                                </Link>
                            </h4>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t-2 mt-24 py-12" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* About Section */}
                        <div>
                            <h3 className="mb-4">tranduy1dol</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                Code Alchemist — transmuting ideas into Rust APIs & ZK sorcery. Based in Hanoi, Vietnam 🇻🇳
                            </p>
                        </div>

                        {/* Navigate Section */}
                        <div>
                            <h4 className="mb-4">{t('footer.navigate')}</h4>
                            <ul className="space-y-2 text-sm">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="hover:opacity-70 transition-opacity"
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            {t(item.labelKey)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Connect Section */}
                        <div>
                            <h4 className="mb-4">{t('footer.connect')}</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://github.com/tranduy1dol"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:opacity-70 transition-opacity"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://twitter.com/tranduy1dol"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:opacity-70 transition-opacity"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:contact@tranduy1dol.com"
                                        className="hover:opacity-70 transition-opacity"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        Email
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
                        style={{ borderColor: 'rgb(var(--color-text-muted))' }}
                    >
                        <p className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
                            © {new Date().getFullYear()} tranduy1dol. All rights reserved.
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
                            Designed with intention and care.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;