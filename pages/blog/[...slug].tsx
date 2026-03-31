import { useState, useEffect } from 'react';
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const Comments = dynamic(() => import('@/components/Comments'), {
    ssr: false,
});



import { getAllPostSlugs, getPostData, PostData } from '@/lib/posts';

type PostProps = {
    postData: PostData;
};

const Post: NextPage<PostProps> = ({ postData }) => {
    const [reactionCount, setReactionCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [copied, setCopied] = useState(false);

    // Listen for Giscus metadata to get reaction + comment counts
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://giscus.app') return;
            if (!event.data?.giscus) return;

            const giscusData = event.data.giscus;
            if (giscusData.discussion) {
                // Reaction count (the emoji reactions on the Discussion itself)
                setReactionCount(giscusData.discussion.reactionCount ?? 0);

                // Comment count
                const total = (giscusData.discussion.totalCommentCount ?? 0) +
                    (giscusData.discussion.totalReplyCount ?? 0);
                setCommentCount(total);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const scrollToReactions = () => {
        const commentSection = document.getElementById('comments-section');
        if (commentSection) {
            commentSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToComments = () => {
        const commentSection = document.getElementById('comments-section');
        if (commentSection) {
            commentSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

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

    // Use headings extracted from markdown
    const headings = postData.headings || [];

    return (
        <>
            <Head>
                <title>{`${postData.title} - tranduy1dol`}</title>
                <meta name="description" content={postData.excerpt} />
            </Head>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm no-underline mb-12 hover:opacity-70 transition-opacity"
                    style={{ color: 'rgb(var(--color-text-muted))' }}
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to all posts
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_250px] gap-12">
                    {/* Left Sidebar - Reactions */}
                    <aside className="hidden lg:block sticky top-32 self-start">
                        <div className="flex flex-col gap-6">
                            <button
                                onClick={scrollToReactions}
                                className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
                                title="React to this post"
                            >
                                <svg
                                    className={`w-6 h-6 transition-all ${reactionCount > 0 ? 'fill-red-500 stroke-red-500' : 'group-hover:stroke-red-500'}`}
                                    style={{ color: reactionCount > 0 ? '#ef4444' : 'rgb(var(--color-text-muted))' }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                </svg>
                                <span className="text-xs" style={{ color: reactionCount > 0 ? '#ef4444' : 'rgb(var(--color-text-muted))' }}>{reactionCount}</span>
                            </button>

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

                            <button
                                onClick={scrollToComments}
                                className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
                            >
                                <svg
                                    className="w-5 h-5 transition-all group-hover:fill-current group-hover:text-blue-500"
                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                </svg>
                                <span className="text-xs group-hover:text-blue-500" style={{ color: 'rgb(var(--color-text-muted))' }}>{commentCount}</span>
                            </button>
                        </div>
                    </aside>

                    {/* Center Column - Article Content */}
                    <article className="max-w-3xl">
                        {/* Article Header */}
                        <header className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h4 style={{ color: 'rgb(var(--color-text-muted))' }}>
                                    {postData.category || 'POST'}
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

                        {/* Related Reading */}
                        <div
                            className="border-t-2 mt-12 pt-8"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            <h4 className="mb-4">Related Reading</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/blog"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                        className="hover:opacity-70 transition-opacity"
                                    >
                                        View all posts
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Comments Section — powered by Giscus (GitHub Discussions) */}
                        <div
                            id="comments-section"
                            className="border-t-2 mt-12 pt-8 scroll-mt-32"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            <h4 className="mb-6 flex items-center gap-2">
                                Comments
                                <span className="text-xs font-normal px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                    Powered by GitHub Discussions
                                </span>
                            </h4>
                            <Comments />
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
                                                >
                                                    {heading.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostSlugs();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.slug as string[]);
    return {
        props: {
            postData,
        },
    };
};