import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Error404: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OpenDocs | Error</title>
        <meta name="description" content="OpenDocs: A WYSIWYG editor like Google Docs that supports Dyslexia, and as a bonus, custom fonts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.error}>404 | The page you requested could not be found.</p>
        <Link href="/" passHref><p className={styles.error}>Back to Home</p></Link>
      </main>
    </div>
  );
}

export default Error404;
