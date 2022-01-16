import {AppProps} from 'next/app';
import Head from 'next/head';
import {
  initializeIcons,
  loadTheme
} from '@fluentui/react';
import './styles.css';
import React from "react";
import {
  kalilaTheme,
  Layout,
  MediaQueryWrapper,
  SignalrStore,
  useKalilaMediaQuery,
  useNavigationEventHandling
} from "@frontend/shared-ui";
import {AnimatePresence} from "framer-motion";
import {useSignalr} from "@frontend/shared-ui";
import {SessionProvider} from 'next-auth/react';

initializeIcons()

loadTheme(kalilaTheme);

function KalilaApp({Component, pageProps, router}: AppProps) {
  const breakpoints = useKalilaMediaQuery();
  const signalrState = useSignalr();
  useNavigationEventHandling(signalrState);
  const {session} = pageProps;
  return (
    <MediaQueryWrapper.Provider value={breakpoints}>
      <SignalrStore.Provider value={{...signalrState}}>
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
      </SignalrStore.Provider>
    </MediaQueryWrapper.Provider>
  );
}


export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
