import {AppProps} from 'next/app';
import Head from 'next/head';
import {SessionProvider} from "next-auth/react"
import {initializeIcons, ThemeProvider} from '@fluentui/react';
import './styles.css';
import {kalilaTheme, useKalilaMediaQuery} from "@frontend/shared-ui-layout";
import React from "react";
import {IKalilaMediaQuery} from "@frontend/shared-ui-layout";

initializeIcons();

const MediaQueryContext = React.createContext<IKalilaMediaQuery>({});

function KalilaApp({Component, pageProps}: AppProps) {
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
        <main className="app">
          <Component {...pageProps} />
        </main>
      </SessionProvider>
      </MediaQueryContext.Provider>
    </ThemeProvider>
  );
}


export default KalilaApp;

// nx g page account --project=kalila --withTests=true --style=scss
