import * as React from 'react';
import Document from 'next/document';
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
    console.log({ctx})
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: [initialProps.styles,
        <style key="fluentui-css" dangerouslySetInnerHTML={{__html: stylesheet.getRules(true)}}/>]
    }
  }
}
