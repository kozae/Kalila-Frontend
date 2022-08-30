import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.scss';
import { EmotionCache } from '@emotion/react/dist/emotion-react.cjs';
import { CacheProvider } from '@emotion/react';
import React, { useMemo, useState } from 'react';
import { kalilaTheme } from '@frontend/shared-ui';
import { ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { EditionsAppContext, Layout } from '../components';
import { createEmotionCache } from './_document';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const clientSideEmotionCache = createEmotionCache();

interface KalilaAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: Session;
}

function CustomApp(appProps: KalilaAppProps) {
  const {
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
    router,
    session,
  } = appProps;
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [editionName, setEditionName] = useState<string | undefined>(undefined);
  const contextValue = useMemo(
    () => ({ showNavbar, setShowNavbar, editionName, setEditionName }),
    [showNavbar, setShowNavbar, editionName, setEditionName]
  );
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href={'/favicon.ico'} />
        <title>Kalila Editions</title>
      </Head>
      <main className="app">
        <ThemeProvider theme={kalilaTheme}>
          <EditionsAppContext.Provider value={contextValue}>
            <SessionProvider session={session}>
              <Layout>
                <AnimatePresence exitBeforeEnter>
                  <Component {...pageProps} key={router.route} />
                </AnimatePresence>
              </Layout>
            </SessionProvider>
          </EditionsAppContext.Provider>
        </ThemeProvider>
      </main>
    </CacheProvider>
  );
}

export default CustomApp;
