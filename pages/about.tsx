import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { Timeline, TimelineItem } from '@/components/Timeline';

import { getSortedBooksData, BookData } from '@/lib/books';
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
];

interface AboutProps {
    contentHtml: string;
    frontMatter: {
        title: string;
        description: string;
    };
    milestones: TimelineItem[];
    latestBooks: BookData[];
}

const About: NextPage<AboutProps> = ({ contentHtml, frontMatter, milestones, latestBooks }) => {
    return (
        <>
            <Head>
                <title>{`${frontMatter.title} - tranduy1dol`}</title>
                <meta name="description" content={frontMatter.description} />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-16">
                    {/* Left Column - Profile (Sticky) */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        {/* Profile Image with Polaroid Effect */}
                        <div
                            className="mb-6 p-4 border-2 inline-block"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-bg))'
                            }}
                        >
                            <div className="relative w-64 h-64 md:w-72 md:h-72 overflow-hidden">
                                <Image
                                    src="/profile.png"
                                    alt="tranduy1dol"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 256px, 288px"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="mb-6">
                            <h1
                                className="text-2xl md:text-3xl mb-2"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                tranduy1dol
                            </h1>
                            <p
                                className="text-sm uppercase tracking-wider mb-4"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Software Developer
                            </p>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Crafting thoughtful software with precision.
                                Based in Vietnam 🇻🇳
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 border-2 transition-all hover:opacity-70"
                                        style={{ borderColor: 'rgb(var(--color-border))' }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Column - Content */}
                    <main className="space-y-12">
                        {/* Markdown Content */}
                        <section className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                        </section>

                        {/* Divider */}
                        <div
                            className="h-[2px] w-24"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* Timeline */}
                        <section>
                            <h2 className="mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Journey</h2>
                            <Timeline milestones={milestones} />
                        </section>

                        {/* Divider */}
                        <div
                            className="h-[2px] w-24"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* What I'm Reading - Dynamic from _books */}
                        <section>
                            <h2 className="mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
                                What I&apos;m Reading
                            </h2>
                            <div className="space-y-4">
                                {latestBooks.map((book) => (
                                    <Link
                                        key={book.id}
                                        href={`/books/${book.id}`}
                                        className="flex items-start gap-4 group no-underline"
                                    >
                                        <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                                            <Image
                                                src={book.cover}
                                                alt={book.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4
                                                className="font-medium group-hover:opacity-70 transition-opacity"
                                                style={{ fontFamily: 'var(--font-serif)' }}
                                            >
                                                {book.title}
                                            </h4>
                                            <p
                                                className="text-sm"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                by {book.author}
                                            </p>
                                            {book.status && (
                                                <span
                                                    className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor: book.status === 'reading'
                                                            ? 'rgba(59, 130, 246, 0.1)'
                                                            : 'rgba(34, 197, 94, 0.1)',
                                                        color: book.status === 'reading'
                                                            ? 'rgb(59, 130, 246)'
                                                            : 'rgb(34, 197, 94)'
                                                    }}
                                                >
                                                    {book.status === 'reading' ? '📖 Currently Reading' : '✓ Completed'}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href="/book"
                                className="inline-block mt-6 text-sm hover:opacity-70 transition-opacity"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                View all books →
                            </Link>
                        </section>

                        {/* Contact CTA */}
                        <section
                            className="border-2 p-8"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-surface))'
                            }}
                        >
                            <h3
                                className="text-xl mb-4"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                Let&apos;s Connect
                            </h3>
                            <p
                                className="mb-6 leading-relaxed"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Have a project in mind or just want to chat about technology?
                                Feel free to reach out. I&apos;m always open to interesting conversations
                                and collaborations.
                            </p>
                            <a
                                href="mailto:contact@tranduy1dol.com"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider no-underline transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: 'rgb(var(--color-text))',
                                    color: 'rgb(var(--color-bg))'
                                }}
                            >
                                <FiMail className="w-4 h-4" />
                                Get in Touch
                            </a>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default About;

export const getStaticProps: GetStaticProps = async () => {
    const contentDirectory = path.join(process.cwd(), '_content');

    // Load about.md content
    const aboutPath = path.join(contentDirectory, 'about.md');
    let contentHtml = '';
    let frontMatter = { title: 'About', description: '' };

    if (fs.existsSync(aboutPath)) {
        const fileContents = fs.readFileSync(aboutPath, 'utf8');
        const { content, data } = matter(fileContents);
        const processedContent = await remark().use(html).process(content);
        contentHtml = processedContent.toString();
        frontMatter = data as typeof frontMatter;
    }

    // Load journey.md for timeline milestones
    const journeyPath = path.join(contentDirectory, 'journey.md');
    let milestones: TimelineItem[] = [];

    if (fs.existsSync(journeyPath)) {
        const journeyContents = fs.readFileSync(journeyPath, 'utf8');
        const { data: journeyData } = matter(journeyContents);
        milestones = journeyData.milestones || [];
    }

    // Get latest 3 books from _books
    const allBooks = getSortedBooksData();
    const latestBooks = allBooks.slice(0, 3);

    return {
        props: {
            contentHtml,
            frontMatter,
            milestones,
            latestBooks,
        },
    };
};
