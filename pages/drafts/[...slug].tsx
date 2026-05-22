import { useState, useEffect } from 'react';
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { useTheme } from 'next-themes';

import { getAllDraftSlugs, getDraftData } from '@/lib/drafts';
import type { PostData } from '@/lib/posts';
import DraftGuard from '@/components/DraftGuard';

type DraftPostProps = {
    postData: PostData;
};

const DraftPost: NextPage<DraftPostProps> = ({ postData }) => {
    const [copied, setCopied] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const initMermaid = async () => {
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === 'dark' ? 'dark' : 'default' });
                await mermaid.run({ querySelector: '.language-mermaid' });
            } catch (err) {
                console.error('Mermaid initialization failed:', err);
            }
        };

        const timeoutId = setTimeout(() => {
            const mermaidElements = document.querySelectorAll('.language-mermaid');
            mermaidElements.forEach(el => {
                if (!el.hasAttribute('data-mermaid-text')) {
                    el.setAttribute('data-mermaid-text', el.textContent || '');
                } else {
                    el.textContent = el.getAttribute('data-mermaid-text') || '';
                }
                el.removeAttribute('data-processed');
            });
            if (mermaidElements.length > 0) {
                initMermaid();
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [postData.contentHtml, resolvedTheme]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).toUpperCase();
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const headings = postData.headings || [];

    return (
        <>
            <Head>
                <title>{`${postData.title} (Draft) - tranduy1dol`}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <DraftGuard>
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Back Link */}
                    <Link
                        href="/drafts"
                        className="inline-flex items-center gap-2 text-sm no-underline mb-12 hover:opacity-70 transition-opacity"
                        style={{ color: 'rgb(var(--color-text-muted))' }}
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to drafts
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_250px] gap-12">
                        {/* Left Sidebar */}
                        <aside className="hidden lg:block sticky top-32 self-start">
                            <div className="flex flex-col gap-6">
                                <button
                                    onClick={handleShare}
                                    className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
                                >
                                    <svg
                                        className={`w-5 h-5 transition-all ${copied ? 'stroke-blue-500' : 'group-hover:stroke-blue-500'}`}
                                        style={{ color: copied ? '#3b82f6' : 'rgb(var(--color-text-muted))' }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </svg>
                                    <span className="text-xs" style={{ color: copied ? '#3b82f6' : 'rgb(var(--color-text-muted))' }}>{copied ? 'Copied!' : 'Share'}</span>
                                </button>
                            </div>
                        </aside>

                        {/* Center Column - Article Content */}
                        <article className="max-w-3xl">
                            {/* Draft Badge */}
                            <div className="mb-4">
                                <span
                                    className="text-xs px-2 py-1 border font-mono"
                                    style={{
                                        color: 'rgb(var(--color-text-muted))',
                                        borderColor: 'rgb(var(--color-text-muted))',
                                    }}
                                >
                                    ✏️ DRAFT — NOT PUBLISHED
                                </span>
                            </div>

                            {/* Article Header */}
                            <header className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <h4 style={{ color: 'rgb(var(--color-text-muted))' }}>
                                        {postData.category || 'NOTE'}
                                    </h4>
                                    <span style={{ color: 'rgb(var(--color-text-muted))' }}>—</span>
                                    <time
                                        className="text-sm"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        {formatDate(postData.date)}
                                    </time>
                                </div>
                                <h1 className="mb-6">{postData.title}</h1>
                                {postData.excerpt && (
                                    <p
                                        className="text-lg leading-relaxed"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        {postData.excerpt}
                                    </p>
                                )}
                            </header>

                            {/* Article Content */}
                            <div
                                className="border-t-2 pt-8"
                                style={{ borderColor: 'rgb(var(--color-border))' }}
                            >
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: postData.contentHtml! }}
                                />
                            </div>
                        </article>

                        {/* Right Column - Table of Contents (Desktop only) */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-8">
                                <h4 className="mb-4">Contents</h4>
                                {headings.length > 0 && (
                                    <nav>
                                        <ul
                                            className="space-y-3 border-l-2 ml-0"
                                            style={{ borderColor: 'rgb(var(--color-text-muted))' }}
                                        >
                                            {headings.map((heading, index) => (
                                                <li
                                                    key={index}
                                                    style={{ paddingLeft: `${(heading.level - 1) * 8 + 16}px` }}
                                                >
                                                    <a
                                                        href={`#${heading.slug}`}
                                                        className="text-sm no-underline block hover:translate-x-1 transition-transform"
                                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                                        dangerouslySetInnerHTML={{ __html: heading.htmlText || heading.text }}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </DraftGuard>
        </>
    );
};

export default DraftPost;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllDraftSlugs();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getDraftData(params?.slug as string[]);
    return {
        props: {
            postData,
        },
    };
};
