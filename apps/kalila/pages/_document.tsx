import * as React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {Stylesheet, resetIds, InjectionMode} from '@fluentui/react';

const stylesheet = Stylesheet.getInstance();

stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: 'server'
})

export default class KalilaAppDocument extends Document<{ styleTags: any, serializedStylesheet: any }> {
  static async getInitialProps(ctx) {
    stylesheet.reset()
    resetIds()
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: [initialProps.styles,
        <style key="fluentui-css" dangerouslySetInnerHTML={{__html: stylesheet.getRules(true)}}/>]
    }
  }
}


// export default class KalilaAppDocument extends Document<{ styleTags: any, serializedStylesheet: any }> {
//   static async getInitialProps(ctx) {
//     resetIds();
//     const page = ctx.renderPage(App => props => <App {...props} />);
//     return {...page, styleTags: stylesheet.getRules(true), serializedStylesheet: stylesheet.serialize()};
//   }
//
//   render() {
//     return (
//       <Html>
//         <Head>
//           <style type="text/css" dangerouslySetInnerHTML={{__html: this.props.styleTags}}/>
//           <script type="text/javascript" dangerouslySetInnerHTML={{
//             __html: `
//             window.FabricConfig = window.FabricConfig || {};
//             window.FabricConfig.serializedStylesheet = ${this.props.serializedStylesheet};
//           `
//           }}/>
//         </Head>
//         <body>
//         <Main/>
//         <NextScript/>
//         </body>
//       </Html>
//     );
//   }
// }
