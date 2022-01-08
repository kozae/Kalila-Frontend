import {AppProps} from 'next/app';
import Head from 'next/head';
import './styles.css';


function KalilApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <title>Welcome to kalila!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}


export default KalilApp;

// nx g page account --project=kalila --withTests=true --style=scss
