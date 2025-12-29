import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData, PostData } from '@/lib/posts';
import { getSpotlightProjects, SpotlightData } from '@/lib/spotlight';
import { TechStack } from '@/components/TechStack';
import { FiArrowRight, FiBookOpen, FiExternalLink, FiDownload } from 'react-icons/fi';

type HomeProps = {
    allPostsData: PostData[];
    spotlights: SpotlightData[];
};

const Home: NextPage<HomeProps> = ({ allPostsData, spotlights }) => {
    const recentPosts = allPostsData.slice(0, 2);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).toUpperCase();
    };

    return (
        <>
            <Head>
                <title>tranduy1dol - Code Alchemist</title>
                <meta name="description" content="Transmuting ideas into high-performance Rust APIs, distributed systems, and Zero-Knowledge solutions." />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <section className="py-16 md:py-24 text-center">
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl mb-6"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        Code Alchemist.
                    </h1>
                    <p
                        className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                        style={{
                            color: 'rgb(var(--color-text-muted))',
                            fontFamily: 'var(--font-sans)'
                        }}
                    >
                        Hello, I&apos;m <strong style={{ color: 'rgb(var(--color-text))' }}>tranduy1dol</strong> —
                        transmuting ideas into high-performance Rust APIs,
                        distributed systems, and Zero-Knowledge sorcery.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm uppercase tracking-wider no-underline transition-all hover:opacity-80"
                            style={{
                                backgroundColor: 'rgb(var(--color-text))',
                                color: 'rgb(var(--color-bg))'
                            }}
                        >
                            <FiBookOpen className="w-4 h-4" />
                            Read Blog
                        </Link>
                        <a
                            href="/Tran_Manh_Duy-Blockchain_Backedn_Developer.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 text-sm uppercase tracking-wider no-underline transition-all hover:opacity-70"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            <FiDownload className="w-4 h-4" />
                            View CV
                        </a>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 text-sm uppercase tracking-wider no-underline transition-all hover:opacity-70"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            More About Me
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* Divider */}
                <div
                    className="h-[2px] max-w-xs mx-auto"
                    style={{ backgroundColor: 'rgb(var(--color-border))' }}
                />

                {/* Tech Stack Strip */}
                <TechStack />

                {/* Divider */}
                <div
                    className="h-[2px] max-w-xs mx-auto mb-16"
                    style={{ backgroundColor: 'rgb(var(--color-border))' }}
                />

                {/* Spotlight Projects Grid */}
                {spotlights.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 style={{ fontFamily: 'var(--font-serif)' }}>Spotlight</h2>
                            <div
                                className="flex-1 h-[2px]"
                                style={{ backgroundColor: 'rgb(var(--color-border))' }}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spotlights.map((project) => (
                                <a
                                    key={project.id}
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="no-underline block group"
                                >
                                    <article
                                        className="border-2 overflow-hidden transition-all hover:shadow-xl h-full flex flex-col"
                                        style={{
                                            borderColor: 'rgb(var(--color-border))',
                                            backgroundColor: 'rgb(var(--color-surface))'
                                        }}
                                    >
                                        {/* Project Image */}
                                        {project.image ? (
                                            <div
                                                className="aspect-video relative border-b-2 overflow-hidden"
                                                style={{ borderColor: 'rgb(var(--color-border))' }}
                                            >
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="aspect-video flex items-center justify-center border-b-2"
                                                style={{
                                                    borderColor: 'rgb(var(--color-border))',
                                                    backgroundColor: 'rgb(var(--color-bg))'
                                                }}
                                            >
                                                <span
                                                    className="text-4xl font-serif opacity-20"
                                                    style={{ fontFamily: 'var(--font-serif)' }}
                                                >
                                                    ❧
                                                </span>
                                            </div>
                                        )}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <span
                                                className="text-xs uppercase tracking-wider mb-2"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                {project.category || 'Project'}
                                            </span>
                                            <h3
                                                className="text-lg mb-2 group-hover:opacity-80 transition-opacity"
                                                style={{ fontFamily: 'var(--font-serif)' }}
                                            >
                                                {project.title}
                                            </h3>
                                            <p
                                                className="text-sm leading-relaxed mb-4 flex-1 font-sans"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                {project.description}
                                            </p>
                                            <span
                                                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                View Project
                                                <FiExternalLink className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </article>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Writings Grid */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Recent Writings</h2>
                        <div
                            className="flex-1 h-[2px]"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />
                        <Link
                            href="/blog"
                            className="text-sm uppercase tracking-wider no-underline hover:opacity-70 transition-opacity"
                            style={{ color: 'rgb(var(--color-text-muted))' }}
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recentPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="no-underline block group"
                            >
                                <article
                                    className="border-2 p-6 h-full transition-all hover:shadow-lg"
                                    style={{
                                        borderColor: 'rgb(var(--color-border))',
                                        backgroundColor: 'rgb(var(--color-surface))'
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span
                                            className="text-xs uppercase tracking-wider"
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            {post.category || 'Post'}
                                        </span>
                                        <span style={{ color: 'rgb(var(--color-text-muted))' }}>·</span>
                                        <time
                                            className="text-xs"
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            {formatDate(post.date)}
                                        </time>
                                    </div>
                                    <h3
                                        className="text-xl mb-3 group-hover:opacity-80 transition-opacity"
                                        style={{ fontFamily: 'var(--font-serif)' }}
                                    >
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgb(var(--color-text-muted))' }}>
                                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                            {post.readTime}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    const spotlights = getSpotlightProjects();
    return {
        props: {
            allPostsData,
            spotlights,
        },
    };
};