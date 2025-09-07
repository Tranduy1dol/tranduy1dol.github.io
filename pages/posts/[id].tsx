import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostIds, getPostData, PostData } from '@/lib/posts';

type PostProps = {
    postData: PostData;
};

const Post: NextPage<PostProps> = ({ postData }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-2xl">
            <Head>
                <title>{postData.title}</title>
            </Head>

            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">{postData.title}</h1>
                <div className="text-neutral-500 dark:text-neutral-400">{postData.date}</div>
            </header>

            <article className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml! }} />
            </article>

            <div className="mt-12">
                <Link href="/" className="text-fuchsia-500 hover:text-fuchsia-600">
                    ← Back to home
                </Link>
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