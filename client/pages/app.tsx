import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import io from 'socket.io-client';
import React from 'react';

export interface UserData {
    username?: string,
    name?: string,
    email?: string,
    phone?: string,
    avatar?: string,
    servers?: [
        {
            icon?: string,
            name?: string,
            id?: string,
            description?: string,
            poster?: string,
            isOwner?: boolean,
            members?: [
                {
                    username?: string,
                    icon?: string,
                    id?: string,
                    status?: {
                        icon?: "online" | "offline" | "idle" | "dnd",
                        message?: string
                    },
                },
            ],
            categories?: [
                {
                    name?: "uncategorized" | string,
                    id?: string,
                    members?: [
                        {
                            name?: string,
                            type?: "text" | "voice" | "stage" | "announcement",
                            id?: string,
                            description?: string,
                        },
                    ],
                },
            ],
        },
    ],
};

const socket = io();
var userData: UserData = {};

const Home: NextPage = () => {
    var [ loading, setLoading ] = React.useState(true);
    socket.on("initialUserData", (data: UserData) => {
        userData = data;
        if(!userData.avatar || userData.avatar.toLowerCase() == "none" || userData.avatar.toLowerCase() == "false" || userData.avatar.toLowerCase() == "null") {
            userData.avatar = userData.username?.charAt(0);
        }
        setLoading(false);
    });
    React.useEffect(() => {
        window.addEventListener("load", () => {
            socket.emit("request_data", null);
        });
    });
    return (
        <div className={styles.container}>
          <Head>
            <title>OpenDocs</title>
            <meta name="description" content="OpenDocs: A WYSIWYG editor like Google Docs that supports Dyslexia, and as a bonus, custom fonts." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

        <main className={styles.main}>
            {
                loading ? (
                    <div className={styles.loader} />
                ) : (
                    <h1 style={{ color: "white", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>Welcome back,&nbsp;<img src={`https://ui-avatars.com/api/?background=ff0000&color=ffffff&name=${userData.avatar}&format=svg&rounded=true&size=40&bold=true`} alt="Profile Picture" width={40} height={40} className={styles.ppic} />&nbsp;{userData.username}.</h1>
                )
            }
        </main>
    </div>
  );
}

export default Home;
