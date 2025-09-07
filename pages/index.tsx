import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getSortedPostsData, PostData } from '@/lib/posts';

type HomeProps = {
    allPostsData: PostData[];
};

const Home: NextPage<HomeProps> = ({ allPostsData }) => {
    return (
        <>
            <Head>
                <title>My Minimal Next.js Blog</title>
            </Head>

            <div className="space-y-6">
                {allPostsData.map(({ id, date, title }) => (
                    <Link
                        key={id}
                        href={`/posts/${id}`}
                        className="block p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">{date}</p>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
};