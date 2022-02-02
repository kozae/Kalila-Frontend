import * as React from "react";
import Document, {Html, Head, Main, NextScript} from "next/document";
import {InjectionMode, resetIds, Stylesheet} from "@fluentui/react";


// Do this in file scope to initialize the stylesheet before Fabric components are imported.
const stylesheet = Stylesheet.getInstance();

// Set the config.
stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: "server",
});

// Now set up the document, and just reset the stylesheet.
export default class MyDocument extends Document {
  static getInitialProps({renderPage}) {
    stylesheet.reset();
    resetIds();

    const page = renderPage((App) => (props) => <App {...props} />);

    return {...page, styleTags: stylesheet.getRules(true)};
  }

  render() {

    return (
      <Html>
        <Head>
          <style
            type="text/css"
            // @ts-ignore
            dangerouslySetInnerHTML={{__html: this.props.styleTags}}
          />
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
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
