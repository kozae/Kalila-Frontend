import {AppProps} from 'next/app';
import Head from 'next/head';
import {SessionProvider} from "next-auth/react"
import {initializeIcons, ThemeProvider} from '@fluentui/react';
import './styles.css';
import React from "react";
import {kalilaTheme, Layout, MediaQueryContext, useKalilaMediaQuery} from "@frontend/shared-ui";
import {AnimatePresence} from "framer-motion";

initializeIcons();


function KalilaApp({Component, pageProps, router}: AppProps) {
  const {session} = pageProps;
  const breakpoints = useKalilaMediaQuery();
  return (
    <ThemeProvider theme={kalilaTheme}>
      <MediaQueryContext.Provider value={breakpoints}>
        <SessionProvider session={session}>
          <Head>
            <link rel="shortcut icon" href={"/favicon.ico"}/>
            <title>Kalila</title>
          </Head>
          <Layout>
            <AnimatePresence exitBeforeEnter>
              <Component {...pageProps} key={router.route}/>
            </AnimatePresence>
          </Layout>
        </SessionProvider>
      </MediaQueryContext.Provider>
    </ThemeProvider>
  );
}


export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
