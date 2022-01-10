import {AppProps} from 'next/app';
import Head from 'next/head';
import {SessionProvider} from "next-auth/react"
import {initializeIcons, ThemeProvider} from '@fluentui/react';
import './styles.css';
import React from "react";
import {kalilaTheme, Layout, useKalilaMediaQuery} from "@frontend/shared-ui";

initializeIcons();


function KalilaApp({Component, pageProps}: AppProps) {
  const {session} = pageProps;
  const breakpoints = useKalilaMediaQuery();
  return (
    <ThemeProvider theme={kalilaTheme}>
      <SessionProvider session={session}>
        <Head>
          <link rel="shortcut icon" href={"/favicon.ico"}/>
          <title>Kalila</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  );
}


export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
