import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import io from 'socket.io-client'

const socket = io();

const Home: NextPage = () => {
  socket.on("connect", () => {
    console.log("%cConnected to Socket.io!", "color: yellow;");
    socket.on("online", (d) => {
      if(document.getElementById("content") === null) return;
      (document.getElementById("content") as HTMLDivElement).innerHTML = `Online: ${d.online}`;
    });
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>OpenDocs [v0.1.0-a20211212]</title>
        <meta name="description" content="OpenDocs - A better WYSIWYG editor with custom fonts, collaboration, custom themes, and support for people with dyslexia." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="content">Online: 0</div>
    </div>
  )
}

export default Home
