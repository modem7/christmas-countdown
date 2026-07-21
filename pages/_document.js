import * as React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

const THEME_COLOR = '#0d0033';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={THEME_COLOR} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
