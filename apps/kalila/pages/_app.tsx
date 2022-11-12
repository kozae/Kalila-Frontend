import 'reflect-metadata';
import 'es6-shim';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.scss';
import React from 'react';
import {
  kalilaTheme,
  Layout,
  NavMessageBarContextProvider,
  SignalrProvider,
  store,
} from '@frontend/shared-ui';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@mui/material';
import { createEmotionCache } from './_document';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ErrorBoundary } from '@frontend/kalila/components';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface KalilaAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: Session;
}

function KalilaApp(appProps: KalilaAppProps) {
  const {
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
    router,
    session,
  } = appProps;

  return (
    <CacheProvider value={emotionCache}>
      <SignalrProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href={'/favicon.ico'} />
          <title>Kalila</title>
        </Head>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <ThemeProvider theme={kalilaTheme}>
              <ReduxProvider store={store}>
                <NavMessageBarContextProvider>
                  <Layout>
                    <AnimatePresence exitBeforeEnter>
                      <Component {...pageProps} key={router.route} />
                    </AnimatePresence>
                  </Layout>
                </NavMessageBarContextProvider>
              </ReduxProvider>
            </ThemeProvider>
          </SessionProvider>
        </ErrorBoundary>
      </SignalrProvider>
    </CacheProvider>
  );
}

export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
// nx g @nrwl/next:lib image-annotation  --directory=ui/text-editing --style=scss
