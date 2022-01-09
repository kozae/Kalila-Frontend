import {AppProps} from 'next/app';
import Head from 'next/head';
import {SessionProvider} from "next-auth/react"
import {initializeIcons, ThemeProvider} from '@fluentui/react';
import './styles.css';
import {kalilaTheme} from "@frontend/shared-ui-layout";

initializeIcons();

function KalilaApp({Component, pageProps}: AppProps) {
  const {session} = pageProps;
  return (
    <ThemeProvider theme={kalilaTheme}>
      <SessionProvider session={session}>
        <Head>
          <link rel="shortcut icon" href={"/favicon.ico"}/>
          <title>Kalila</title>
        </Head>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
}


export default KalilaApp;

// nx g page account --project=kalila --withTests=true --style=scss
