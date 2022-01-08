import { AppProps, AppContext  } from 'next/app';
import Head from 'next/head';
import './styles.css';
import cookie from 'cookie'
import type { IncomingMessage } from 'http'
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr'

const keycloakCfg = {
  realm: '',
  url: '',
  clientId: '',
}

interface InitialProps {
  cookies: unknown
}

function KalilApp({ Component, pageProps, cookies  }: AppProps & InitialProps) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
    >
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Welcome to kalila!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </SSRKeycloakProvider>
  );
}

function parseCookies(req: IncomingMessage) {
  return cookie.parse(req.headers.cookie || '')
}

KalilApp.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  return {
    cookies: context.ctx.req ? parseCookies(context.ctx.req) : {},
  }
}


export default KalilApp;

// nx g page account --project=kalila --withTests=true --style=scss
