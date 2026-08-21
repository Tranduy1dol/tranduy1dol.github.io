import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getSortedPostsData, getAllTags, BilingualPostData, TagCount } from '@/lib/posts';
import { getSortedBooksData, BilingualBookData } from '@/lib/books';
import { getSpotlightProjects, BilingualSpotlightData } from '@/lib/spotlight';
import { TechStack } from '@/components/TechStack';
import { useLanguage } from '@/lib/LanguageContext';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiDownload, FiExternalLink } from 'react-icons/fi';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/tranduy1dol', label: 'GitHub' },
    { icon: FiTwitter, href: 'https://twitter.com/tranduy1dol', label: 'Twitter' },
    { icon: FiLinkedin, href: 'https://linkedin.com/in/tranduy1dol', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:contact@tranduy1dol.com', label: 'Email' },
    { icon: FiDownload, href: '/cv.pdf', label: 'CV', isCV: true },
];

type HomeProps = {
    allPostsData: BilingualPostData[];
    allTags: TagCount[];
    allBooksData: BilingualBookData[];
    spotlights: BilingualSpotlightData[];
    aboutHtml: { vn: string; en: string };
};

type ActiveTab = 'blog' | 'book';

const Home: NextPage<HomeProps> = ({ allPostsData, allTags, allBooksData, spotlights, aboutHtml }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('blog');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const { language } = useLanguage();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).toUpperCase();
    };

    // Filter posts based on search and selected tag
    const filteredPosts = allPostsData.filter((bilingualPost) => {
        const post = bilingualPost[language];
        const matchesSearch = searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag === null ||
            (bilingualPost.tags && bilingualPost.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    // Render star rating for books
    const renderRating = (rating?: number) => {
        if (!rating) return null;
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'opacity-100' : 'opacity-30'}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head>
                <title>tranduy1dol - Software Engineer</title>
                <meta name="description" content="Transmuting ideas into high-performance Rust APIs, distributed systems, and Zero-Knowledge solutions." />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-8 lg:gap-10">

                    {/* ========== LEFT SIDEBAR ========== */}
                    <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-8 py-6 space-y-6">
                        {/* Avatar with Polaroid Effect */}
                        <div
                            className="p-3 border-2 inline-block"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-bg))'
                            }}
                        >
                            <div className="relative w-48 h-48 overflow-hidden">
                                <Image
                                    src="/profile.png"
                                    alt="tranduy1dol"
                                    fill
                                    className="object-cover"
                                    sizes="192px"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Name & Info */}
                        <div>
                            <h3
                                className="text-xl mb-1"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                tranduy1dol
                            </h3>
                            <p
                                className="text-sm uppercase tracking-wider mb-3"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                              Software Engineer
                            </p>
                            <p
                                className="text-sm leading-relaxed italic"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                “A man is as unhappy as he has convinced himself he is.”
                            </p>
                            <p
                                className="text-xs mt-2 uppercase tracking-wider"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                — Seneca
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 flex-wrap">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                const isExternal = !('isCV' in social);
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target={isExternal ? '_blank' : '_blank'}
                                        rel="noopener noreferrer"
                                        className="p-2 border-2 transition-all hover:opacity-70"
                                        style={{ borderColor: 'rgb(var(--color-border))' }}
                                        aria-label={social.label}
                                        title={social.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div
                            className="h-[2px]"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* Tags */}
                        <div>
                            <h4 className="mb-3">Tags</h4>
                            <ul className="space-y-2">
                                {/* All posts option */}
                                <li>
                                    <button
                                        onClick={() => { setSelectedTag(null); setActiveTab('blog'); }}
                                        className={`text-sm no-underline flex justify-between items-center group w-full text-left ${selectedTag === null ? 'font-bold' : ''
                                            }`}
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        <span className="group-hover:underline">All</span>
                                        <span>({allPostsData.length})</span>
                                    </button>
                                </li>
                                {allTags.map((tag) => (
                                    <li key={tag.name}>
                                        <button
                                            onClick={() => { setSelectedTag(tag.name); setActiveTab('blog'); }}
                                            className={`text-sm no-underline flex justify-between items-center group w-full text-left ${selectedTag === tag.name ? 'font-bold' : ''
                                                }`}
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            <span className="group-hover:underline">{tag.name}</span>
                                            <span>({tag.count})</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* ========== CENTER COLUMN ========== */}
                    <div className="py-8 space-y-8 min-w-0">
                        {/* About Me */}
                        <section>
                            <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>About Me</h2>
                            <div className="prose prose-lg max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: aboutHtml[language] }} />
                            </div>
                        </section>

                        {/* Tech Stack - constrained to center column */}
                        <TechStack />

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border-2 bg-transparent focus:outline-none transition-colors"
                                style={{
                                    borderColor: 'rgb(var(--color-border))',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>

                        {/* Tab Navigation */}
                        <div
                            className="flex gap-6 border-b-2"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            <button
                                onClick={() => setActiveTab('blog')}
                                className={`pb-3 text-sm uppercase tracking-wider transition-opacity relative ${activeTab === 'blog' ? 'opacity-100 font-bold' : 'opacity-60 hover:opacity-80'
                                    }`}
                                style={{
                                    borderBottom: activeTab === 'blog' ? '2px solid rgb(var(--color-text))' : '2px solid transparent',
                                    marginBottom: '-2px',
                                }}
                            >
                                Blog
                            </button>
                            <button
                                onClick={() => setActiveTab('book')}
                                className={`pb-3 text-sm uppercase tracking-wider transition-opacity relative ${activeTab === 'book' ? 'opacity-100 font-bold' : 'opacity-60 hover:opacity-80'
                                    }`}
                                style={{
                                    borderBottom: activeTab === 'book' ? '2px solid rgb(var(--color-text))' : '2px solid transparent',
                                    marginBottom: '-2px',
                                }}
                            >
                                Book
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'blog' && (
                            <div className="space-y-6">
                                {filteredPosts.length === 0 ? (
                                    <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                                        No posts found matching your criteria.
                                    </p>
                                ) : (
                                    filteredPosts.map((bilingualPost) => {
                                        const post = bilingualPost[language];
                                        return (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${bilingualPost.slug.join('/')}`}
                                                className="no-underline block group"
                                            >
                                                <article
                                                    className="border-2 p-5 transition-all hover:shadow-lg"
                                                    style={{
                                                        borderColor: 'rgb(var(--color-border))',
                                                        backgroundColor: 'rgb(var(--color-surface))'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <time
                                                            className="text-xs"
                                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                                        >
                                                            {formatDate(bilingualPost.date)}
                                                        </time>
                                                        {bilingualPost.tags && bilingualPost.tags.length > 0 && (
                                                            <>
                                                                <span
                                                                    className="text-xs"
                                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                                >·</span>
                                                                {bilingualPost.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="text-xs px-2 py-0.5 border"
                                                                        style={{
                                                                            color: 'rgb(var(--color-text-muted))',
                                                                            borderColor: 'rgb(var(--color-text-muted))'
                                                                        }}
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl leading-tight mb-2 group-hover:opacity-80 transition-opacity">
                                                        {post.title}
                                                    </h3>
                                                    {post.excerpt && (
                                                        <p
                                                            className="text-sm mb-4 leading-relaxed"
                                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                                        >
                                                            {post.excerpt}
                                                        </p>
                                                    )}
                                                    <div
                                                        className="flex items-center justify-between pt-3 border-t"
                                                        style={{ borderColor: 'rgb(var(--color-text-muted))' }}
                                                    >
                                                        <span
                                                            className="text-xs"
                                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                                        >
                                                            {post.readTime}
                                                        </span>
                                                        <span
                                                            className="text-xs border-b pb-0.5 hover:opacity-70 transition-opacity"
                                                            style={{ borderColor: 'rgb(var(--color-border))' }}
                                                        >
                                                            READ ARTICLE →
                                                        </span>
                                                    </div>
                                                </article>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {activeTab === 'book' && (
                            <div>
                                {allBooksData.length === 0 ? (
                                    <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                                        No books yet. Add markdown files to the <code>_books</code> folder.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {allBooksData.map((bilingualBook) => {
                                            const book = bilingualBook[language];
                                            return (
                                                <Link
                                                    key={bilingualBook.id}
                                                    href={`/books/${bilingualBook.id}`}
                                                    className="group no-underline h-full"
                                                >
                                                    <div
                                                        className="border-2 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                                                        style={{
                                                            borderColor: 'rgb(var(--color-border))',
                                                            backgroundColor: 'rgb(var(--color-surface))'
                                                        }}
                                                    >
                                                        {/* Book Cover - 2:3 aspect ratio */}
                                                        <div
                                                            className="aspect-[2/3] overflow-hidden border-b-2 flex-shrink-0 relative"
                                                            style={{ borderColor: 'rgb(var(--color-border))' }}
                                                        >
                                                            <Image
                                                                src={bilingualBook.cover}
                                                                alt={book.title}
                                                                fill
                                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                            />
                                                        </div>
                                                        {/* Book Info */}
                                                        <div className="p-3 flex-1 flex flex-col">
                                                            <h3
                                                                className="text-sm leading-tight mb-1 group-hover:opacity-70 transition-opacity"
                                                                style={{ fontFamily: 'var(--font-serif)' }}
                                                            >
                                                                {book.title}
                                                            </h3>
                                                            <p
                                                                className="text-xs mb-1"
                                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                                            >
                                                                by {book.author}
                                                            </p>
                                                            {bilingualBook.rating && (
                                                                <div
                                                                    className="text-xs mt-auto"
                                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                                >
                                                                    {renderRating(bilingualBook.rating)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ========== RIGHT SIDEBAR ========== */}
                    <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-8 py-6">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h4>Recent Projects</h4>
                                <div
                                    className="flex-1 h-[2px]"
                                    style={{ backgroundColor: 'rgb(var(--color-border))' }}
                                />
                            </div>

                            <div className="space-y-4">
                                {spotlights.map((bilingualProject) => {
                                    const project = bilingualProject[language];
                                    return (
                                        <a
                                            key={bilingualProject.id}
                                            href={bilingualProject.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="no-underline block group"
                                        >
                                            <div
                                                className="border-2 overflow-hidden transition-all hover:shadow-lg"
                                                style={{
                                                    borderColor: 'rgb(var(--color-border))',
                                                    backgroundColor: 'rgb(var(--color-surface))'
                                                }}
                                            >
                                                {bilingualProject.image && (
                                                    <div
                                                        className="aspect-video overflow-hidden border-b-2 relative"
                                                        style={{ borderColor: 'rgb(var(--color-border))' }}
                                                    >
                                                        <Image
                                                            src={bilingualProject.image}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <h3
                                                        className="text-sm mb-2 group-hover:opacity-80 transition-opacity"
                                                        style={{ fontFamily: 'var(--font-serif)' }}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                    <p
                                                        className="text-xs leading-relaxed mb-3"
                                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                                    >
                                                        {project.description}
                                                    </p>
                                                    <span
                                                        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider"
                                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                                    >
                                                        View Project
                                                        <FiExternalLink className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
    // Blog data
    const allPostsData = getSortedPostsData();
    const allTags = getAllTags();

    // Book data
    const allBooksData = getSortedBooksData();

    // Spotlight projects
    const spotlights = getSpotlightProjects();

    // About content — load bilingual variants
    const contentDirectory = path.join(process.cwd(), '_content');
    const aboutVnPath = path.join(contentDirectory, 'about.vn.md');
    const aboutEnPath = path.join(contentDirectory, 'about.en.md');
    const aboutFallbackPath = path.join(contentDirectory, 'about.md');

    async function loadAboutHtml(filePath: string): Promise<string> {
        if (!fs.existsSync(filePath)) return '';
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content } = matter(fileContents);
        const processedContent = await remark().use(html).process(content);
        return processedContent.toString();
    }

    let aboutVnHtml = await loadAboutHtml(aboutVnPath);
    let aboutEnHtml = await loadAboutHtml(aboutEnPath);
    const aboutFallbackHtml = await loadAboutHtml(aboutFallbackPath);

    // Apply fallback logic
    if (!aboutVnHtml) aboutVnHtml = aboutFallbackHtml || aboutEnHtml;
    if (!aboutEnHtml) aboutEnHtml = aboutFallbackHtml || aboutVnHtml;

    return {
        props: {
            allPostsData,
            allTags,
            allBooksData,
            spotlights,
            aboutHtml: {
                vn: aboutVnHtml,
                en: aboutEnHtml,
            },
        },
    };
};
