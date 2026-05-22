import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getSortedDraftsData, getAllDraftTags } from '@/lib/drafts';
import type { PostData, TagCount } from '@/lib/posts';
import DraftGuard from '@/components/DraftGuard';

type DraftsProps = {
    allDraftsData: PostData[];
    allTags: TagCount[];
};

const Drafts: NextPage<DraftsProps> = ({ allDraftsData, allTags }) => {
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

    const filteredDrafts = allDraftsData.filter((draft) => {
        const matchesSearch = searchQuery === '' ||
            draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (draft.excerpt && draft.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTag = selectedTag === null ||
            (draft.tags && draft.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    return (
        <>
            <Head>
                <title>Drafts - tranduy1dol</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <DraftGuard>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
                        {/* Left Content - Draft List */}
                        <main className="space-y-6">
                            {filteredDrafts.length === 0 ? (
                                <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                                    No drafts found matching your criteria.
                                </p>
                            ) : (
                                filteredDrafts.map((draft) => (
                                    <Link
                                        key={draft.id}
                                        href={`/drafts/${draft.slug.join('/')}`}
                                        className="no-underline block group"
                                    >
                                        <article
                                            className="border-2 p-6 transition-all hover:shadow-lg"
                                            style={{
                                                borderColor: 'rgb(var(--color-border))',
                                                backgroundColor: 'rgb(var(--color-surface))',
                                                borderLeftWidth: '4px',
                                                borderLeftColor: 'rgb(var(--color-text-muted))',
                                            }}
                                        >
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span
                                                    className="text-xs px-2 py-0.5 border font-mono"
                                                    style={{
                                                        color: 'rgb(var(--color-text-muted))',
                                                        borderColor: 'rgb(var(--color-text-muted))',
                                                    }}
                                                >
                                                    DRAFT
                                                </span>
                                                <h4 style={{ color: 'rgb(var(--color-text-muted))' }}>
                                                    {draft.category || 'NOTE'}
                                                </h4>
                                                <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>—</span>
                                                <time className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                                    {formatDate(draft.date)}
                                                </time>
                                                {draft.tags && draft.tags.length > 0 && (
                                                    <>
                                                        <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>·</span>
                                                        {draft.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs px-2 py-0.5 border"
                                                                style={{
                                                                    color: 'rgb(var(--color-text-muted))',
                                                                    borderColor: 'rgb(var(--color-text-muted))',
                                                                }}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                            <h3 className="mb-2 group-hover:opacity-80 transition-opacity">
                                                {draft.title}
                                            </h3>
                                            {draft.excerpt && (
                                                <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                                    {draft.excerpt}
                                                </p>
                                            )}
                                            <div
                                                className="flex items-center justify-between pt-3 mt-3 border-t"
                                                style={{ borderColor: 'rgb(var(--color-text-muted))' }}
                                            >
                                                <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                                    {draft.readTime}
                                                </span>
                                                <span
                                                    className="text-xs border-b pb-0.5 hover:opacity-70 transition-opacity"
                                                    style={{ borderColor: 'rgb(var(--color-border))' }}
                                                >
                                                    READ DRAFT →
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))
                            )}
                        </main>

                        {/* Right Sidebar - Search & Tags */}
                        <aside className="space-y-8 md:sticky md:top-8 md:self-start">
                            <div>
                                <h4 className="mb-4">Search</h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search drafts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 border-2 bg-transparent focus:outline-none transition-colors"
                                        style={{
                                            borderColor: 'rgb(var(--color-border))',
                                            backgroundColor: 'transparent',
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

                            <div>
                                <h4 className="mb-4">Tags</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setSelectedTag(null)}
                                            className={`text-sm no-underline flex justify-between items-center group w-full text-left ${selectedTag === null ? 'font-bold' : ''}`}
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            <span className="group-hover:underline">All</span>
                                            <span>({allDraftsData.length})</span>
                                        </button>
                                    </li>
                                    {allTags.map((tag) => (
                                        <li key={tag.name}>
                                            <button
                                                onClick={() => setSelectedTag(tag.name)}
                                                className={`text-sm no-underline flex justify-between items-center group w-full text-left ${selectedTag === tag.name ? 'font-bold' : ''}`}
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
                    </div>
                </div>
            </DraftGuard>
        </>
    );
};

export default Drafts;

export const getStaticProps: GetStaticProps = async () => {
    const allDraftsData = getSortedDraftsData();
    const allTags = getAllDraftTags();
    return {
        props: {
            allDraftsData,
            allTags,
        },
    };
};
