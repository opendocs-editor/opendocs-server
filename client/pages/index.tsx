import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import React from 'react';

const Home: NextPage = () => {
  React.useEffect(() => { window.location.replace("/app"); });
  return (
    <div className={styles.container}>
      <Head>
        <title>OpenDocs</title>
        <meta name="description" content="OpenDocs: A WYSIWYG editor like Google Docs that supports Dyslexia, and as a bonus, custom fonts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.loader} />
      </main>
    </div>
  );
}

export default Home;
