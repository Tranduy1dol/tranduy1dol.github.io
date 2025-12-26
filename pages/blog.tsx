import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getSortedPostsData, getAllTags, PostData, TagCount } from '@/lib/posts';

type BlogProps = {
    allPostsData: PostData[];
    allTags: TagCount[];
};

const Blog: NextPage<BlogProps> = ({ allPostsData, allTags }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).toUpperCase();
    };

    // Filter posts based on search and selected tag
    const filteredPosts = allPostsData.filter((post) => {
        const matchesSearch = searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag === null ||
            (post.tags && post.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    return (
        <>
            <Head>
                <title>Blog - tranduy1dol</title>
                <meta name="description" content="All posts and writings by tranduy1dol" />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
                    {/* Left Sidebar */}
                    <aside className="space-y-8 md:sticky md:top-8 md:self-start">
                        {/* Search */}
                        <div>
                            <h4 className="mb-4">Search</h4>
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
                        </div>

                        {/* Tags */}
                        <div>
                            <h4 className="mb-4">Tags</h4>
                            <ul className="space-y-2">
                                {/* All posts option */}
                                <li>
                                    <button
                                        onClick={() => setSelectedTag(null)}
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
                                            onClick={() => setSelectedTag(tag.name)}
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

                    {/* Right Content - Blog List */}
                    <main className="space-y-8">
                        {filteredPosts.length === 0 ? (
                            <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                                No posts found matching your criteria.
                            </p>
                        ) : (
                            filteredPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/posts/${post.id}`}
                                    className="no-underline block group"
                                >
                                    <article
                                        className="border-2 p-8 transition-all hover:shadow-lg"
                                        style={{
                                            borderColor: 'rgb(var(--color-border))',
                                            backgroundColor: 'rgb(var(--color-surface))'
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <h4 style={{ color: 'rgb(var(--color-text-muted))' }}>
                                                {post.category || 'POST'}
                                            </h4>
                                            <span
                                                className="text-xs"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >—</span>
                                            <time
                                                className="text-xs"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                {formatDate(post.date)}
                                            </time>
                                            {post.tags && post.tags.length > 0 && (
                                                <>
                                                    <span
                                                        className="text-xs"
                                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                                    >·</span>
                                                    {post.tags.map((tag) => (
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
                                        <h3 className="mb-4 group-hover:opacity-80 transition-opacity">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p
                                                className="mb-6 leading-relaxed"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div
                                            className="flex items-center justify-between pt-4 border-t"
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
                            ))
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Blog;

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    const allTags = getAllTags();
    return {
        props: {
            allPostsData,
            allTags,
        },
    };
};
