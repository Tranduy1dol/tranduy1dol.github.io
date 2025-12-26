import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSortedBooksData, BookData } from '@/lib/books';

type BookPageProps = {
    allBooksData: BookData[];
};

const BookPage: NextPage<BookPageProps> = ({ allBooksData }) => {
    // Render star rating
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
                <title>Book - tranduy1dol</title>
                <meta name="description" content="Reading list and book reviews by tranduy1dol" />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                {/* Page Header */}
                <header className="mb-12">
                    <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Reading Collection</h2>
                    <p
                        className="max-w-2xl font-sans"
                        style={{ color: 'rgb(var(--color-text-muted))' }}
                    >
                        A curated selection of books on design, architecture, and the philosophy of form.
                        Click on a book to read my review and notes.
                    </p>
                </header>

                {/* Book Grid - 3 columns */}
                {allBooksData.length === 0 ? (
                    <p style={{ color: 'rgb(var(--color-text-muted))' }}>
                        No books yet. Add markdown files to the <code>_books</code> folder.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {allBooksData.map((book) => (
                            <Link
                                key={book.id}
                                href={`/books/${book.id}`}
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
                                            src={book.cover}
                                            alt={book.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        />
                                    </div>
                                    {/* Book Info */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3
                                            className="text-lg mb-1 group-hover:opacity-70 transition-opacity"
                                            style={{ fontFamily: 'var(--font-serif)' }}
                                        >
                                            {book.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-2"
                                            style={{ color: 'rgb(var(--color-text-muted))' }}
                                        >
                                            by {book.author}
                                        </p>
                                        {book.rating && (
                                            <div
                                                className="text-sm mt-auto"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                {renderRating(book.rating)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BookPage;

export const getStaticProps: GetStaticProps = async () => {
    const allBooksData = getSortedBooksData();
    return {
        props: {
            allBooksData,
        },
    };
};
