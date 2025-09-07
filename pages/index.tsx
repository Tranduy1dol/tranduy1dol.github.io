import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../lib/posts';
import styles from '../styles/Home.module.css';

type HomeProps = {
  allPostsData: PostData[];
};

const Home: NextPage<HomeProps> = ({ allPostsData }) => {
  return (
      <div className={styles.container}>
        <Head>
          <title>My Minimal Next.js Blog</title>
        </Head>

        <header className={styles.header}>
          <h1>My Minimal Blog</h1>
        </header>

        <main>
          <section>
            <h2>Blog Posts</h2>
            <ul className={styles.postList}>
              {allPostsData.map(({ id, date, title }) => (
                  <li key={id} className={styles.postListItem}>
                      <Link href={`/posts/${id}`}>
                          {title}
                      </Link>
                    <br />
                    <small className={styles.lightText}>{date}</small>
                  </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
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