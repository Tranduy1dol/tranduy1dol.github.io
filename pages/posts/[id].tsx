import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostIds, getPostData, PostData } from '../../lib/posts';
import styles from '../../styles/Home.module.css';

type PostProps = {
    postData: PostData;
};

const Post: NextPage<PostProps> = ({ postData }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>{postData.title}</title>
            </Head>

            <header className={styles.header}>
                <h1>{postData.title}</h1>
                <div className={styles.lightText}>{postData.date}</div>
            </header>

            <main>
                <article>
                    <div dangerouslySetInnerHTML={{ __html: postData.contentHtml! }} />
                </article>
                <div className={styles.backToHome}>
                    <Link href="/">
                        ← Back to home
                    </Link>
                </div>
            </main>
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