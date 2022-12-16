import 'reflect-metadata';
import 'es6-shim';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.scss';
import { createEmotionCache } from './_document';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { KalilaAppWrapper } from '@frontend/kalila/components';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MuhaqiqAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MuhaqiqApp(appProps: MuhaqiqAppProps) {
  const {
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
    router,
  } = appProps;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href={'/favicon.ico'} />
        <title>Kalila</title>
      </Head>
      <KalilaAppWrapper>
        <Component {...pageProps} key={router.route} />
      </KalilaAppWrapper>
    </CacheProvider>
  );
}

export default MuhaqiqApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
// nx g @nrwl/next:lib real-app  --directory=kalila --style=scss
