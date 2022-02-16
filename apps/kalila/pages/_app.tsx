import 'reflect-metadata';
import 'es6-shim';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.scss';
import React from 'react';
import {
  kalilaTheme,
  Layout,
  MediaQueryWrapper,
  NavMessageBarContext,
  SignalrStore,
  useKalilaMediaQuery,
  useNavigationEventHandling,
} from '@frontend/shared-ui';
import { AnimatePresence } from 'framer-motion';
import { useSignalr } from '@frontend/shared-ui';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material';
import { createEmotionCache } from './_document';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { useNavMessageBarControls } from '@frontend/shared-ui';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface KalilaAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function KalilaApp(appProps: KalilaAppProps) {
  const {
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
    router,
  } = appProps;
  const breakpoints = useKalilaMediaQuery();
  const signalrState = useSignalr();
  useNavigationEventHandling(signalrState);
  const navMessageContextValue = useNavMessageBarControls();
  const { session } = pageProps;
  return (
    <CacheProvider value={emotionCache}>
      <SignalrStore.Provider value={{ ...signalrState }}>
        <SessionProvider session={session}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
            <link rel="shortcut icon" href={'/favicon.ico'} />
            <title>Kalila</title>
          </Head>
          <ThemeProvider theme={kalilaTheme}>
            <ReduxProvider store={store}>
              <MediaQueryWrapper.Provider value={breakpoints}>
                <NavMessageBarContext.Provider value={navMessageContextValue}>
                  <Layout>
                    <AnimatePresence exitBeforeEnter>
                      <Component {...pageProps} key={router.route} />
                    </AnimatePresence>
                  </Layout>
                </NavMessageBarContext.Provider>
              </MediaQueryWrapper.Provider>
            </ReduxProvider>
          </ThemeProvider>
        </SessionProvider>
      </SignalrStore.Provider>
    </CacheProvider>
  );
}

export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
// nx g @nrwl/next:lib documents-detailed-view  --directory=ui --style=scss
