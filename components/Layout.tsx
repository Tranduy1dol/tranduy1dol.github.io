import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LuCake } from 'react-icons/lu';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

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
            <header className="border-b-2 py-6" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-3xl md:text-4xl">
                            <Link href="/" className="no-underline hover:opacity-70 transition-opacity">
                                Hi, I&apos;m tranduy1dol
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
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;