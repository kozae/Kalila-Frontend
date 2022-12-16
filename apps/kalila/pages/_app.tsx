import 'reflect-metadata';
import 'es6-shim';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.scss';
import { createEmotionCache } from './_document';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { KalilaAppWrapper } from '@frontend/kalila/components';

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
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href={'/favicon.ico'} />
        <title>Kalila</title>
      </Head>
      <SessionProvider session={session}>
        <KalilaAppWrapper>
          <Component {...pageProps} key={router.route} />
        </KalilaAppWrapper>
      </SessionProvider>
    </CacheProvider>
  );
}

export default KalilaApp;

// nx g page book-analysis --project=kalila --withTests=true --style=scss
// nx g @nrwl/next:lib real-app  --directory=kalila --style=scss
