import * as React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {Stylesheet, resetIds} from '@fluentui/react';


const stylesheet = Stylesheet.getInstance();

export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    // resetIds(0);

    // eslint-disable-next-line react/display-name
    const page = renderPage(App => props => <App {...props} />);

    return {...page, styleTags: stylesheet.getRules(true), serializedStylesheet: stylesheet.serialize()};
  }

  render() {
    return (
      <Html>
        <Head>
          <style type="text/css" dangerouslySetInnerHTML={{__html: this.props.styleTags}}/>
          <script type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
            window.FabricConfig = window.FabricConfig || {};
            window.FabricConfig.serializedStylesheet = ${this.props.serializedStylesheet};
          `
          }}/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}
