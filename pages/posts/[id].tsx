import { useState, useEffect } from 'react';
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { getAllPostIds, getPostData, PostData } from '@/lib/posts';

type PostProps = {
    postData: PostData;
};

const Post: NextPage<PostProps> = ({ postData }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [copied, setCopied] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const storedLike = localStorage.getItem(`like-${postData.id}`);
        if (storedLike === 'true') {
            setLiked(true);
            setLikeCount(1);
        }

        const storedComments = localStorage.getItem(`comments-${postData.id}`);
        if (storedComments) {
            setComments(JSON.parse(storedComments));
        }
    }, [postData.id]);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComments = [...comments, commentText];
        setComments(newComments);
        setCommentText('');
        localStorage.setItem(`comments-${postData.id}`, JSON.stringify(newComments));
    };

    const deleteComment = (index: number) => {
        const newComments = comments.filter((_, i) => i !== index);
        setComments(newComments);
        localStorage.setItem(`comments-${postData.id}`, JSON.stringify(newComments));
    };

    const scrollToComments = () => {
        const commentSection = document.getElementById('comments-section');
        if (commentSection) {
            commentSection.scrollIntoView({ behavior: 'smooth' });
            setShowComments(true);
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

    const handleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(newLikedState ? 1 : 0);
        localStorage.setItem(`like-${postData.id}`, newLikedState.toString());
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
                                onClick={handleLike}
                                className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
                            >
                                <svg
                                    className={`w-6 h-6 transition-all ${liked ? 'fill-red-500 stroke-red-500' : 'group-hover:stroke-red-500'}`}
                                    style={{ color: liked ? '#ef4444' : 'rgb(var(--color-text-muted))' }}
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
                                <span className={`text-xs ${liked ? 'text-red-500' : ''}`} style={{ color: liked ? '#ef4444' : 'rgb(var(--color-text-muted))' }}>{likeCount}</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center gap-2 group relative transition-transform active:scale-95"
                            >
                                {copied && (
                                    <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-black text-white rounded whitespace-nowrap opacity-80">
                                        Copied!
                                    </span>
                                )}
                                <svg
                                    className={`w-5 h-5 transition-all group-hover:fill-current ${copied ? 'stroke-blue-500' : ''}`}
                                    style={{ color: copied ? '#3b82f6' : 'rgb(var(--color-text-muted))' }}
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
                                <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>Share</span>
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
                                <span className="text-xs group-hover:text-blue-500" style={{ color: 'rgb(var(--color-text-muted))' }}>{comments.length}</span>
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

                        {/* Comments Section */}
                        <div
                            id="comments-section"
                            className="border-t-2 mt-12 pt-8 scroll-mt-32"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                        >
                            <h4 className="mb-6 flex items-center gap-2">
                                Personal Notes
                                <span className="text-xs font-normal px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                    Private • Stored locally
                                </span>
                            </h4>

                            <form onSubmit={handleCommentSubmit} className="mb-8">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a note to yourself..."
                                    className="w-full p-4 rounded-lg border bg-transparent resize-y min-h-[100px] mb-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    style={{ borderColor: 'rgb(var(--color-border))' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                                    style={{
                                        backgroundColor: 'rgb(var(--color-text))',
                                        color: 'rgb(var(--color-bg))'
                                    }}
                                >
                                    Add Note
                                </button>
                            </form>

                            <div className="space-y-6">
                                {comments.map((comment, index) => (
                                    <div key={index} className="group flex gap-4">
                                        <div className="flex-1">
                                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteComment(index)}
                                            className="self-start p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            title="Delete note"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}

                                {comments.length === 0 && (
                                    <p className="text-center italic py-8" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                        No notes yet.
                                    </p>
                                )}
                            </div>
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