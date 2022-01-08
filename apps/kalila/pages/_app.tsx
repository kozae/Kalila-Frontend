import {AppProps} from 'next/app';
import Head from 'next/head';
import {SessionProvider} from "next-auth/react"
import './styles.css';


function KalilApp({Component, pageProps}: AppProps) {
  const {session} = pageProps;
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <title>Welcome to kalila!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}


export default KalilApp;

// nx g page account --project=kalila --withTests=true --style=scss
