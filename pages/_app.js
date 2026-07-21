import * as React from 'react';
import Head from 'next/head';
import { Space_Grotesk as SpaceGrotesk, Fraunces } from 'next/font/google';

import '../css/main.css';

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600'],
  style: ['italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`app-fonts ${spaceGrotesk.variable} ${fraunces.variable}`}>
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

        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
