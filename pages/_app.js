import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

import '../css/fonts.css';
import '../css/main.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Yet Another Christmas Countdown!</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <meta name="apple-mobile-web-app-status-bar-style" content="#070026" />

        <meta name="og:title" content="Yet Another Christmas Countdown!" />
        <meta name="tiwtter:title" content="Yet Another Christmas Countdown!" />

        <meta name="og:url" content="https://YetAnotherChristmasCountdown.com" />

        <meta name="og:description" content="A Christmas Countdown with no ads or social media icons, only the countdown!" />
        <meta name="description" content="A Christmas Countdown with no ads or social media icons, only the countdown!" />
        <meta name="twitter:description" content="A Christmas Countdown with no ads or social media icons, only the countdown!" />

        <meta name="twitter:image" content="https://yetanotherchristmascountdown.com/social-media-picture.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:image" content="https://yetanotherchristmascountdown.com/social-media-picture.jpg" />

        <script data-host="https://microanalytics.io" data-dnt="false" src="https://microanalytics.io/js/script.js" id="ZwSg9rf6GA" async defer>{}</script>

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object, // eslint-disable-line
  pageProps: PropTypes.object.isRequired, // eslint-disable-line
};
