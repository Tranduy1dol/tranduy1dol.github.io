import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostIds, getPostData, PostData } from '@/lib/posts';

type PostProps = {
    postData: PostData;
};

const Post: NextPage<PostProps> = ({ postData }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).toUpperCase();
    };

    // Use headings extracted from markdown
    const headings = postData.headings || [];

    return (
        <div className="max-w-7xl mx-auto px-6">
            <Head>
                <title>{`${postData.title} - tranduy1dol`}</title>
                <meta name="description" content={postData.excerpt || postData.title} />
            </Head>

            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_240px] gap-8">
                {/* Left Column - Reactions (Desktop only) */}
                <aside className="hidden lg:block">
                    <div
                        className="sticky top-8 border-2 p-4 flex flex-col items-center gap-6"
                        style={{
                            borderColor: 'rgb(var(--color-border))',
                            backgroundColor: 'rgb(var(--color-surface))'
                        }}
                    >
                        <button className="flex flex-col items-center gap-2 group">
                            <svg
                                className="w-5 h-5 transition-all group-hover:fill-current"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
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
                            <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>42</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <svg
                                className="w-5 h-5 transition-all group-hover:fill-current"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                            </svg>
                            <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>18</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <svg
                                className="w-5 h-5 transition-all group-hover:fill-current"
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
                            <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>7</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group">
                            <svg
                                className="w-5 h-5 transition-all group-hover:fill-current"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
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
    );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.id as string);
    return {
        props: {
            postData,
        },
    };
};