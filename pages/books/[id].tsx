import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBookIds, getBookData, BilingualBookData } from '@/lib/books';
import { useLanguage } from '@/lib/LanguageContext';
import { FiArrowLeft } from 'react-icons/fi';

type BookDetailProps = {
    bookData: BilingualBookData;
};

const BookDetail: NextPage<BookDetailProps> = ({ bookData }) => {
    const { language } = useLanguage();
    const book = bookData[language];

    // Render star rating
    const renderRating = (rating?: number) => {
        if (!rating) return null;
        return (
            <div className="flex gap-1 text-xl">
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
        <div className="max-w-7xl mx-auto px-6">
            <Head>
                <title>{`${book.title} - tranduy1dol`}</title>
                <meta name="description" content={`Book review: ${book.title} by ${book.author}`} />
            </Head>

            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm no-underline mb-8 hover:opacity-70 transition-opacity"
                style={{ color: 'rgb(var(--color-text-muted))' }}
            >
                <FiArrowLeft className="w-4 h-4" />
                Back to home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
                {/* Left Column - Book Cover */}
                <aside>
                    <div
                        className="border-2 overflow-hidden sticky top-8"
                        style={{
                            borderColor: 'rgb(var(--color-border))',
                            backgroundColor: 'rgb(var(--color-surface))'
                        }}
                    >
                        <div className="aspect-[2/3] relative">
                            <Image
                                src={bookData.cover}
                                alt={book.title}
                                fill
                                className="object-cover"
                                sizes="300px"
                                priority
                            />
                        </div>
                        <div className="p-6">
                            <h3
                                className="text-base font-semibold mb-2"
                                style={{
                                    fontFamily: 'var(--font-serif)'
                                }}
                            >
                                {book.title}
                            </h3>
                            <p
                                className="text-sm mb-4"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                by {book.author}
                            </p>
                            {bookData.rating && (
                                <div className="mb-4">
                                    {renderRating(bookData.rating)}
                                </div>
                            )}
                            {bookData.status && (
                                <span
                                    className="inline-block px-3 py-1 text-xs uppercase tracking-wider border"
                                    style={{ borderColor: 'rgb(var(--color-border))' }}
                                >
                                    {bookData.status.replace('-', ' ')}
                                </span>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Column - Review Content */}
                <article>
                    <header className="mb-8">
                        <h1
                            className="text-3xl md:text-4xl mb-4"
                            style={{ fontFamily: 'var(--font-serif)' }}
                        >
                            {book.title}
                        </h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <span style={{ color: 'rgb(var(--color-text-muted))' }}>
                                by {book.author}
                            </span>
                            {bookData.dateRead && (
                                <>
                                    <span style={{ color: 'rgb(var(--color-text-muted))' }}>·</span>
                                    <span
                                        className="text-sm"
                                        style={{ color: 'rgb(var(--color-text-muted))' }}
                                    >
                                        Read on {new Date(bookData.dateRead).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Review Content */}
                    <div
                        className="border-t-2 pt-8"
                        style={{ borderColor: 'rgb(var(--color-border))' }}
                    >
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: book.contentHtml! }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BookDetail;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllBookIds();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const bookData = await getBookData(params?.id as string);
    return {
        props: {
            bookData,
        },
    };
};
