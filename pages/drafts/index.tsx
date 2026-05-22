import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getSortedDraftsData } from '@/lib/drafts';
import type { PostData } from '@/lib/posts';
import DraftGuard from '@/components/DraftGuard';

type DraftsProps = {
    allDraftsData: PostData[];
};

const Drafts: NextPage<DraftsProps> = ({ allDraftsData }) => {
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
                <title>Drafts - tranduy1dol</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <DraftGuard>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 style={{ margin: 0 }}>Drafts</h1>
                            </div>
                        </div>

                        {/* Draft List */}
                        <div className="space-y-6">
                            {allDraftsData.length === 0 ? (
                                <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                                    No drafts yet.
                                </p>
                            ) : (
                                allDraftsData.map((draft) => (
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
                                                <span
                                                    className="text-xs"
                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                >—</span>
                                                <time
                                                    className="text-xs"
                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                >
                                                    {formatDate(draft.date)}
                                                </time>
                                            </div>
                                            <h3 className="mb-2 group-hover:opacity-80 transition-opacity">
                                                {draft.title}
                                            </h3>
                                            {draft.excerpt && (
                                                <p
                                                    className="text-sm leading-relaxed"
                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                >
                                                    {draft.excerpt}
                                                </p>
                                            )}
                                            <div
                                                className="flex items-center justify-between pt-3 mt-3 border-t"
                                                style={{ borderColor: 'rgb(var(--color-text-muted))' }}
                                            >
                                                <span
                                                    className="text-xs"
                                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                                >
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
                        </div>
                    </div>
                </div>
            </DraftGuard>
        </>
    );
};

export default Drafts;

export const getStaticProps: GetStaticProps = async () => {
    const allDraftsData = getSortedDraftsData();
    return {
        props: {
            allDraftsData,
        },
    };
};
