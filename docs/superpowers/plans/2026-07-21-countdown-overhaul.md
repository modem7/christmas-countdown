# Christmas Countdown Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the christmas-countdown app's visuals (fonts, glow effects, animated digits, custom icons), remove analytics and the on-page author footer, update licensing, and improve Docker/CI build caching — with zero change to the countdown's actual date/event logic.

**Architecture:** MUI/Emotion are removed in favor of plain CSS + CSS custom properties. Countdown state (which phase we're in, and the digits) moves into a single `useCountdownPhase` hook owned by `pages/index.js`, which passes plain props down to a purely presentational `Countdown` component and to new `AmbientGlow`/`Sparkles` background-effect components. Digit rendering becomes a small `FlipDigit` component animated with Framer Motion. Fonts move from manually-hosted `.ttf` files to `next/font/google`.

**Tech Stack:** Next.js (Pages Router, static export), React, Luxon (unchanged), Framer Motion (new), `next/font/google` (new), plain CSS. Yarn Berry 4.17.1.

## Global Constraints

- Preserve the countdown's exact date/event behavior as documented in `README.md`'s "Detailed Behaviour" section (Christmas countdown → "Merry Christmas!" on Dec 25 → "Happy Holidays!" Dec 26–30 → New Year countdown → "Happy New Year!" on Jan 1). `src/getTimeToNextEvent.js` is not modified.
- No test framework exists and none is being introduced. Verification per task is `yarn lint`, `yarn build` (static export), and — where visual behavior changes — a manual/Playwright check per CLAUDE.md's requirement to verify UI changes in a browser before calling them done.
- The static-export deployment model (`next.config.js` `output: 'export'`) is unchanged; no new pages or routes.
- `LICENSE.txt` must retain the original Pier-Luc Brault 2021 copyright line — this is a dual notice, not a replacement.
- Package manager is Yarn Berry 4.17.1 (`packageManager: yarn@4.17.1` in `package.json`) — use `yarn`, never `npm`.
- All work happens on the already-checked-out branch `overhaul/modern-redesign`. Do not push or open a PR as part of this plan — that's a separate, later step.
- Never add a `Co-Authored-By` trailer to commits.

---

### Task 1: Remove analytics script and copyright footer

**Files:**
- Modify: `pages/_app.js`
- Modify: `pages/index.js`
- Modify: `css/main.css`

**Interfaces:**
- Produces: no interface change — `Index` and `MyApp` keep the same export shape.

- [ ] **Step 1: Remove the Microanalytics script tag from `pages/_app.js`**

Delete this line (currently line 40):

```jsx
        <script data-host="https://microanalytics.io" data-dnt="false" src="https://microanalytics.io/js/script.js" id="ZwSg9rf6GA" async defer>{}</script>
```

- [ ] **Step 2: Remove the copyright footer from `pages/index.js`**

Replace the entire file with:

```jsx
import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  return (
    <>
      <Snowfall />
      <Countdown />
    </>
  );
}
```

(The `useState`/`useEffect` for `year`/`showFooter` are gone along with the footer that used them — `Index` will be rewritten again in Task 4 to wire in the new phase hook, so this intermediate version is intentionally minimal.)

- [ ] **Step 3: Remove the footer CSS rules from `css/main.css`**

Delete these rules (currently lines 38–72):

```css
footer {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  font-family: "MountainsOfChristmas";
  font-size: 0.8rem;
  
}

footer a {
  color: #413a60;
  text-decoration: none;
  text-transform: uppercase;
}

.hide-footer {
  font-family: Arial, Helvetica, sans-serif;
  color: #413a60;
  text-decoration: underline;
  background: none;
  border: none;
}

.hide-footer::before {
  content: "(";
}

.hide-footer::after {
  content: ")";
}

.hide-footer:hover {
  cursor: pointer;
}

footer a:hover {
  font-weight: bold;
}
```

- [ ] **Step 4: Verify**

Run: `grep -rn "microanalytics\|plbrault.com\|hide-footer" pages/ css/`
Expected: no matches (empty output).

Run: `cd /home/modem7/project/christmas-countdown && yarn lint`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add pages/_app.js pages/index.js css/main.css
git commit -m "Remove analytics script and copyright footer"
```

---

### Task 2: Update LICENSE.txt to a dual-copyright notice

**Files:**
- Modify: `LICENSE.txt`

- [ ] **Step 1: Replace the copyright line**

Replace the first line of `LICENSE.txt`:

```
Copyright (c) 2021 Pier-Luc Brault <pier-luc@brault.me>
```

with:

```
Copyright (c) 2021 Pier-Luc Brault <pier-luc@brault.me>
Copyright (c) 2026 Alex Lane
```

The rest of the file (the permission/warranty text) is unchanged.

- [ ] **Step 2: Verify**

Run: `head -3 LICENSE.txt`
Expected:
```
Copyright (c) 2021 Pier-Luc Brault <pier-luc@brault.me>
Copyright (c) 2026 Alex Lane

```

- [ ] **Step 3: Commit**

```bash
git add LICENSE.txt
git commit -m "Add dual copyright notice to LICENSE.txt"
```

---

### Task 3: Remove MUI/Emotion app-shell scaffolding

**Files:**
- Modify: `pages/_document.js`
- Modify: `css/main.css`
- Delete: `src/theme.js`
- Delete: `src/createEmotionCache.js`

**Interfaces:**
- Produces: `pages/_document.js` no longer imports from `../src/theme` or `../src/createEmotionCache` — both files are deleted in this task, so nothing later may import them either.

- [ ] **Step 1: Rewrite `pages/_document.js`**

Replace the entire file with:

```jsx
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
```

- [ ] **Step 2: Delete the now-unused MUI theme and Emotion cache files**

```bash
git rm src/theme.js src/createEmotionCache.js
```

- [ ] **Step 3: Add a base CSS reset to the top of `css/main.css`**

Insert this block at the very top of `css/main.css`, before the existing `html { height: 100%; }` rule:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Verify**

Run: `cd /home/modem7/project/christmas-countdown && yarn build`
Expected: build succeeds (exit 0). Note: this build still has `pages/_app.js` importing MUI (`ThemeProvider`, `CssBaseline`, `CacheProvider`) referencing `../src/theme` and `../src/createEmotionCache`, which Step 2 just deleted — **this build is expected to fail** at this point because `pages/_app.js` hasn't been updated yet. That's fine; `_app.js` is rewritten in Task 4, which is when `yarn build` should be run to confirm green. Skip the build check for this task and instead verify with:

Run: `test ! -f src/theme.js && test ! -f src/createEmotionCache.js && echo OK`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add pages/_document.js css/main.css
git commit -m "Remove Emotion SSR plumbing from _document.js, delete MUI theme"
```

---

### Task 4: Lift countdown state into a hook; make Countdown presentational; drop remaining MUI usage

**Files:**
- Create: `src/useCountdownPhase.js`
- Modify: `src/Countdown.js` (full rewrite)
- Modify: `pages/index.js` (full rewrite)
- Modify: `pages/_app.js` (full rewrite)
- Modify: `package.json`

**Interfaces:**
- Produces (`src/useCountdownPhase.js`): default export `useCountdownPhase()` → `{ days: number, hours: number, minutes: number, seconds: number, isBeforeChristmas: boolean, isChristmas: boolean, isHolidays: boolean, isNewYearsEve: boolean, isNewYear: boolean }`. This is the shape every later task (`Countdown`, `AmbientGlow`, `Sparkles`) consumes.
- Produces (`src/Countdown.js`): default export `Countdown(props)` where `props` is exactly the object returned by `useCountdownPhase()`. No internal state, no MUI.
- Consumes: `src/getTimeToNextEvent.js`'s existing default export (unchanged, returns `{ nextEvent, days, hours, minutes, seconds, milliseconds, totalSeconds }`).

- [ ] **Step 1: Create `src/useCountdownPhase.js`**

```js
import { useEffect, useState } from 'react';

import getTimeToNextEvent from './getTimeToNextEvent';

export default function useCountdownPhase() {
  const [timeToNextEvent, setTimeToNextEvent] = useState(getTimeToNextEvent());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeToNextEvent(getTimeToNextEvent());
    }, 100); // interval of 100 instead of 1000 to minimize drift

    return () => clearInterval(intervalId);
  }, []);

  const {
    nextEvent, days, hours, minutes, seconds, totalSeconds,
  } = timeToNextEvent;

  return {
    days,
    hours,
    minutes,
    seconds,
    isBeforeChristmas: nextEvent === 'CHRISTMAS' && totalSeconds > 0,
    isChristmas: nextEvent === 'CHRISTMAS' && totalSeconds === 0,
    isHolidays: nextEvent === 'NEW_YEAR' && days > 0,
    isNewYearsEve: nextEvent === 'NEW_YEAR' && days === 0 && totalSeconds > 0,
    isNewYear: nextEvent === 'NEW_YEAR' && totalSeconds === 0,
  };
}
```

- [ ] **Step 2: Rewrite `src/Countdown.js`**

```jsx
import React from 'react';

function Icons({ isNewYearPhase }) {
  return (
    <span className="emojis">
      {isNewYearPhase ? '🍾🍾🍾' : '🎄🎄🎄'}
    </span>
  );
}

export default function Countdown({
  isBeforeChristmas,
  isChristmas,
  isHolidays,
  isNewYearsEve,
  isNewYear,
  days,
  hours,
  minutes,
  seconds,
}) {
  const isNewYearPhase = isNewYearsEve || isNewYear;

  return (
    <div className={`countdown-container ${isNewYearPhase ? 'new-year' : ''}`}>
      <div className="label">
        {isBeforeChristmas ? 'Time Left Until Christmas' : ''}
        {isNewYearsEve ? 'Time Left Until New Year' : ''}
      </div>
      <Icons isNewYearPhase={isNewYearPhase} />
      <span className="text-during-event">
        {isChristmas ? 'Merry Christmas!' : ''}
        {isHolidays ? 'Happy Holidays!' : ''}
        {isNewYear ? 'Happy New Year!' : ''}
      </span>
      <div className="time-before-next-event">
        {
          (isBeforeChristmas || isNewYearsEve) ? (
            <>
              {
                isBeforeChristmas ? (
                  <>
                    <span className="number">{String(days).padStart(2, '0')}</span>
                    &nbsp;days&nbsp;
                  </>
                ) : ''
              }
              <span className="number">{String(hours).padStart(2, '0')}</span>
              &nbsp;hours&nbsp;
              <span className="number">{String(minutes).padStart(2, '0')}</span>
              &nbsp;minutes&nbsp;
              <span className="number">{String(seconds).padStart(2, '0')}</span>
              &nbsp;seconds
            </>
          ) : (<>&nbsp;</>)
        }
      </div>
      <Icons isNewYearPhase={isNewYearPhase} />
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `pages/index.js`**

```jsx
import React from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';
import useCountdownPhase from '../src/useCountdownPhase';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  const phase = useCountdownPhase();

  return (
    <>
      <Snowfall />
      <Countdown {...phase} />
    </>
  );
}
```

- [ ] **Step 4: Rewrite `pages/_app.js`** (drops MUI/Emotion, keeps all existing `<Head>` meta tags minus the analytics script already removed in Task 1)

```jsx
import * as React from 'react';
import Head from 'next/head';

import '../css/main.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Yet Another Christmas Countdown!</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <meta name="apple-mobile-web-app-status-bar-style" content="#0d0033" />

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
    </>
  );
}
```

- [ ] **Step 5: Remove MUI/Emotion/clsx/prop-types dependencies**

```bash
cd /home/modem7/project/christmas-countdown
yarn remove @mui/material @emotion/cache @emotion/react @emotion/server @emotion/styled clsx prop-types
```

- [ ] **Step 6: Verify**

Run: `grep -rn "@mui\|@emotion\|prop-types\|clsx" pages/ src/ package.json`
Expected: no matches.

Run: `yarn lint`
Expected: exits 0.

Run: `yarn build`
Expected: exits 0, produces `out/` directory.

- [ ] **Step 7: Commit**

```bash
git add src/useCountdownPhase.js src/Countdown.js pages/index.js pages/_app.js package.json yarn.lock
git commit -m "Drop MUI/Emotion; lift countdown state into useCountdownPhase hook"
```

---

### Task 5: Swap hosted fonts for next/font/google (Space Grotesk + Great Vibes)

**Files:**
- Modify: `pages/_app.js`
- Modify: `css/main.css`
- Delete: `css/fonts.css`
- Delete: `public/fonts/AmaticSC-Bold.ttf`
- Delete: `public/fonts/MountainsofChristmas-Regular.ttf`
- Delete: `font-licenses/AmaticSC-License.txt`
- Delete: `font-licenses/MountainsOfChristmas-License.txt`

**Interfaces:**
- Produces: two CSS custom properties available globally, `--font-space-grotesk` and `--font-great-vibes`, set on a wrapper `<div className="app-fonts">` that every page is rendered inside. Later CSS (`css/main.css`) references these via `var(--font-space-grotesk)` / `var(--font-great-vibes)`.

- [ ] **Step 1: Wire up the fonts in `pages/_app.js`**

Replace the full file with:

```jsx
import * as React from 'react';
import Head from 'next/head';
import { Space_Grotesk, Great_Vibes } from 'next/font/google';

import '../css/main.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`app-fonts ${spaceGrotesk.variable} ${greatVibes.variable}`}>
      <Head>
        <title>Yet Another Christmas Countdown!</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />

        <meta name="apple-mobile-web-app-status-bar-style" content="#0d0033" />

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
```

- [ ] **Step 2: Delete the old font files and import**

```bash
cd /home/modem7/project/christmas-countdown
git rm css/fonts.css public/fonts/AmaticSC-Bold.ttf public/fonts/MountainsofChristmas-Regular.ttf font-licenses/AmaticSC-License.txt font-licenses/MountainsOfChristmas-License.txt
```

- [ ] **Step 3: Update font-family references in `css/main.css`**

Change:

```css
.label {
  font-family: "MountainsOfChristmas";
  font-weight: bold;
}

.time-before-next-event, .text-during-event {
  font-family: "AmaticSC";
  font-weight: bold;
  text-align: center;
}
```

to:

```css
.label {
  font-family: var(--font-space-grotesk), Arial, sans-serif;
  font-weight: 700;
}

.time-before-next-event {
  font-family: var(--font-space-grotesk), Arial, sans-serif;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.text-during-event {
  font-family: var(--font-great-vibes), cursive;
  font-weight: 400;
  text-align: center;
}
```

Also add, right after the `#__next { height: 100%; }` rule:

```css
.app-fonts {
  height: 100%;
}
```

- [ ] **Step 4: Verify**

Run: `test ! -f css/fonts.css && test ! -d font-licenses && echo OK`
Expected: `OK`

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

Run: `grep -c "font-family: var(--font-space-grotesk)" out/index.html`
Expected: a number > 0 (confirms the font CSS made it into the exported HTML's inlined styles or linked stylesheet — if this grep finds nothing because Next.js hashed/split the CSS into a separate file, instead run `grep -rl "font-space-grotesk" out/_next/static/css/*.css` and expect at least one match).

- [ ] **Step 5: Commit**

```bash
git add pages/_app.js css/main.css css/fonts.css public/fonts font-licenses
git commit -m "Replace hosted Christmas fonts with next/font Space Grotesk + Great Vibes"
```

---

### Task 6: New palette, glow effects, and drifting ambient background

**Files:**
- Modify: `css/main.css` (full rewrite)
- Create: `src/AmbientGlow.js`
- Modify: `pages/index.js`
- Modify: `src/Countdown.js`

**Interfaces:**
- Produces (`src/AmbientGlow.js`): default export `AmbientGlow({ isNewYearPhase: boolean })`, renders a fixed-position decorative layer. No return value consumed by callers beyond mounting it.

- [ ] **Step 1: Create `src/AmbientGlow.js`**

```jsx
import React from 'react';

export default function AmbientGlow({ isNewYearPhase }) {
  return (
    <div className={`ambient-glow ${isNewYearPhase ? 'new-year' : ''}`} aria-hidden="true">
      <span className="ambient-glow-blob ambient-glow-blob--one" />
      <span className="ambient-glow-blob ambient-glow-blob--two" />
    </div>
  );
}
```

- [ ] **Step 2: Wire `AmbientGlow` into `pages/index.js`**

Replace the full file with:

```jsx
import React from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';
import AmbientGlow from '../src/AmbientGlow';
import useCountdownPhase from '../src/useCountdownPhase';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  const phase = useCountdownPhase();
  const isNewYearPhase = phase.isNewYearsEve || phase.isNewYear;

  return (
    <>
      <AmbientGlow isNewYearPhase={isNewYearPhase} />
      <Snowfall />
      <Countdown {...phase} />
    </>
  );
}
```

- [ ] **Step 3: Rename the icon wrapper class in `src/Countdown.js`**

In the `Icons` function, change:

```jsx
    <span className="emojis">
```

to:

```jsx
    <span className="icon-row">
```

(This lines up with the CSS rewrite in the next step, which defines `.icon-row` instead of `.emojis`.)

- [ ] **Step 4: Rewrite `css/main.css`** in full:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

:root {
  --color-bg-top: #000000;
  --color-bg-bottom: #0d0033;
  --color-christmas: #ff2d55;
  --color-christmas-glow: rgba(255, 45, 85, 0.85);
  --color-new-year: #39ff88;
  --color-new-year-glow: rgba(57, 255, 136, 0.85);
}

html {
  height: 100%;
}

body {
  height: 100%;
  background-image: linear-gradient(to bottom, var(--color-bg-top), var(--color-bg-bottom));
  overflow: hidden;
}

#__next {
  height: 100%;
}

.app-fonts {
  height: 100%;
}

.ambient-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ambient-glow-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}

.ambient-glow-blob--one {
  top: -15%;
  left: -10%;
  width: 60vmax;
  height: 60vmax;
  background: radial-gradient(circle, var(--color-christmas-glow) 0%, transparent 70%);
  animation: drift-one 22s ease-in-out infinite alternate;
}

.ambient-glow-blob--two {
  bottom: -20%;
  right: -10%;
  width: 55vmax;
  height: 55vmax;
  background: radial-gradient(circle, rgba(80, 60, 220, 0.5) 0%, transparent 70%);
  animation: drift-two 26s ease-in-out infinite alternate;
}

.ambient-glow.new-year .ambient-glow-blob--one {
  background: radial-gradient(circle, var(--color-new-year-glow) 0%, transparent 70%);
}

@keyframes drift-one {
  from { transform: translate(0, 0); }
  to { transform: translate(6vmax, 8vmax); }
}

@keyframes drift-two {
  from { transform: translate(0, 0); }
  to { transform: translate(-5vmax, -6vmax); }
}

.sparkles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.spark {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffd76a;
  box-shadow: 0 0 6px 2px rgba(255, 215, 106, 0.9);
  opacity: 0;
  animation-name: spark-burst;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
}

@keyframes spark-burst {
  0% { transform: scale(0); opacity: 0; }
  15% { transform: scale(1); opacity: 1; }
  60% { transform: scale(1.4); opacity: 0.6; }
  100% { transform: scale(0.2); opacity: 0; }
}

.countdown-container {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  --text-color: var(--color-christmas);
  --glow-color: var(--color-christmas-glow);
  color: var(--text-color);
}

.countdown-container.new-year {
  --text-color: var(--color-new-year);
  --glow-color: var(--color-new-year-glow);
}

.label,
.time-before-next-event,
.text-during-event {
  text-shadow:
    0 0 2px rgba(0, 0, 0, 0.7),
    0 0 10px var(--glow-color),
    0 0 26px var(--glow-color);
}

.label {
  font-family: var(--font-space-grotesk), Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.time-before-next-event {
  font-family: var(--font-space-grotesk), Arial, sans-serif;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.text-during-event {
  font-family: var(--font-great-vibes), cursive;
  font-weight: 400;
  text-align: center;
}

.icon-row {
  display: inline-flex;
  align-items: center;
}

@media screen and (min-width: 300px) {
  .label, .icon-row { font-size: 1.25rem; }
  .time-before-next-event { font-size: 1.25rem; }
  .text-during-event { font-size: 3rem; }
  .number { font-size: 2.2275rem; }
  .icon-row, .label, .time-before-next-event, .text-during-event, .number {
    -webkit-text-size-adjust: none;
  }
}

@media screen and (min-width: 360px) {
  .label, .icon-row { font-size: 1.4rem; }
  .time-before-next-event { font-size: 1.3rem; }
  .text-during-event { font-size: 4rem; }
  .number { font-size: 3rem; }
}

@media screen and (min-width: 378px) {
  .label, .icon-row { font-size: 1.5rem; }
  .time-before-next-event { font-size: 1.5rem; }
  .text-during-event { font-size: 4rem; }
  .number { font-size: 3rem; }
}

@media screen and (min-width: 400px) {
  .label, .icon-row { font-size: 1.5rem; }
  .time-before-next-event { font-size: 1.75rem; }
  .text-during-event { font-size: 4.5rem; }
  .number { font-size: 3rem; }
}

@media screen and (min-width: 500px) {
  .label, .icon-row { font-size: 1.6rem; }
  .time-before-next-event { font-size: 2rem; }
  .text-during-event { font-size: 5.5rem; }
  .number { font-size: 3.25rem; }
}

@media screen and (min-width: 600px) {
  .label, .icon-row { font-size: 2rem; }
  .time-before-next-event { font-size: 2.5rem; }
  .text-during-event { font-size: 6.5rem; }
  .number { font-size: 3.5rem; }
}

@media screen and (min-width: 700px) {
  .label, .icon-row { font-size: 2rem; }
  .time-before-next-event { font-size: 2.5rem; }
  .text-during-event { font-size: 7.8rem; }
  .number { font-size: 5rem; }
}

@media screen and (min-width: 800px) {
  .label, .icon-row { font-size: 2rem; }
  .time-before-next-event { font-size: 3rem; }
  .text-during-event { font-size: 9rem; }
  .number { font-size: 6rem; }
}

@media screen and (min-width: 1200px) {
  .label, .icon-row { font-size: 2.5rem; }
  .time-before-next-event { font-size: 3rem; }
  .text-during-event { font-size: 9rem; }
  .number { font-size: 9rem; }
}
```

- [ ] **Step 5: Verify**

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

Run: `yarn dev` (in background), then use the webapp-testing skill to open `http://localhost:3000` in a browser and take a screenshot.
Expected: dark navy/black gradient background, red glowing text, two soft blurred colored shapes visible in the background, slowly drifting, tree emoji still visible (icons are replaced with SVGs in Task 7).

- [ ] **Step 6: Commit**

```bash
git add css/main.css src/AmbientGlow.js pages/index.js src/Countdown.js
git commit -m "Redesign palette with neon glow text and drifting ambient background"
```

---

### Task 7: Custom SVG icons replacing emoji

**Files:**
- Create: `src/icons/TreeIcon.js`
- Create: `src/icons/ChampagneIcon.js`
- Modify: `src/Countdown.js`
- Modify: `css/main.css`

**Interfaces:**
- Produces (`src/icons/TreeIcon.js`, `src/icons/ChampagneIcon.js`): default exports, both `(props) => <svg ...>`, accepting a `className` prop like any SVG component.

- [ ] **Step 1: Create `src/icons/TreeIcon.js`**

```jsx
import React from 'react';

export default function TreeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 2 L6 10 H9 L4 17 H20 L15 10 H18 Z" />
      <line x1="12" y1="17" x2="12" y2="22" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/icons/ChampagneIcon.js`**

```jsx
import React from 'react';

export default function ChampagneIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M9 2 L10 12 A2 2 0 0 0 14 12 L15 2 Z" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <path d="M4 6 L6 4 M20 6 L18 4 M4 12 L6 10" strokeWidth="1" />
    </svg>
  );
}
```

- [ ] **Step 3: Update the `Icons` component in `src/Countdown.js`**

Replace:

```jsx
import React from 'react';

function Icons({ isNewYearPhase }) {
  return (
    <span className="icon-row">
      {isNewYearPhase ? '🍾🍾🍾' : '🎄🎄🎄'}
    </span>
  );
}
```

with:

```jsx
import React from 'react';

import TreeIcon from './icons/TreeIcon';
import ChampagneIcon from './icons/ChampagneIcon';

function Icons({ isNewYearPhase }) {
  const Icon = isNewYearPhase ? ChampagneIcon : TreeIcon;
  return (
    <span className="icon-row">
      <Icon className="event-icon" />
      <Icon className="event-icon" />
      <Icon className="event-icon" />
    </span>
  );
}
```

(The rest of `src/Countdown.js` is unchanged.)

- [ ] **Step 4: Add icon styling to `css/main.css`**

Add this rule right after the existing `.icon-row { ... }` rule:

```css
.event-icon {
  color: var(--text-color);
  filter: drop-shadow(0 0 6px var(--glow-color));
  width: 1.2em;
  height: 1.2em;
  margin: 0 0.15em;
}
```

- [ ] **Step 5: Verify**

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

Run: `yarn dev` (in background), use the webapp-testing skill to screenshot `http://localhost:3000`.
Expected: three glowing tree-outline icons above and below the countdown, in place of the tree emoji.

- [ ] **Step 6: Commit**

```bash
git add src/icons src/Countdown.js css/main.css
git commit -m "Replace emoji decorations with glowing custom SVG icons"
```

---

### Task 8: Animated flip/roll digits with Framer Motion

**Files:**
- Modify: `package.json`
- Create: `src/FlipDigit.js`
- Modify: `src/Countdown.js`
- Modify: `css/main.css`

**Interfaces:**
- Produces (`src/FlipDigit.js`): default export `FlipDigit({ value: string })`, renders one animated character.
- Consumes: `framer-motion`'s `AnimatePresence` and `motion` exports.

- [ ] **Step 1: Add the `framer-motion` dependency**

```bash
cd /home/modem7/project/christmas-countdown
yarn add framer-motion
```

- [ ] **Step 2: Create `src/FlipDigit.js`**

```jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const digitVariants = {
  enter: { y: '-100%', opacity: 0 },
  center: { y: '0%', opacity: 1 },
  exit: { y: '100%', opacity: 0 },
};

export default function FlipDigit({ value }) {
  return (
    <span className="flip-digit">
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="flip-digit-value"
          variants={digitVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
```

- [ ] **Step 3: Update `src/Countdown.js`** to render digits through `FlipDigit`

Add the import and a small helper near the top:

```jsx
import FlipDigit from './FlipDigit';
```

Add this component right after the `Icons` function:

```jsx
function FlipNumber({ value }) {
  return value.split('').map((digit, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <FlipDigit key={index} value={digit} />
  ));
}
```

Replace every occurrence of:

```jsx
<span className="number">{String(days).padStart(2, '0')}</span>
```

with:

```jsx
<FlipNumber value={String(days).padStart(2, '0')} />
```

— and likewise for `hours`, `minutes`, and `seconds` (four replacements total, one per unit).

- [ ] **Step 4: Rename `.number` to `.flip-digit` in `css/main.css` and add flip-specific rules**

In every `@media` block, change `.number { font-size: ...; }` to `.flip-digit { font-size: ...; }`, and change the selector list `.icon-row, .label, .time-before-next-event, .text-during-event, .number {` (only present in the `min-width: 300px` block) to `.icon-row, .label, .time-before-next-event, .text-during-event, .flip-digit {`.

Add this new rule right after the `.event-icon { ... }` rule:

```css
.flip-digit {
  position: relative;
  display: inline-block;
  width: 1ch;
  height: 1em;
  overflow: hidden;
  vertical-align: bottom;
}

.flip-digit-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 5: Verify**

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

Run: `yarn dev` (in background), use the webapp-testing skill to open `http://localhost:3000`, wait 2 seconds, and take two screenshots one second apart.
Expected: the seconds digits visibly differ between the two screenshots, and (ideally captured as a short recording/gif via the skill) the digit transition shows a slide/roll rather than an instant swap.

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock src/FlipDigit.js src/Countdown.js css/main.css
git commit -m "Animate countdown digits with a Framer Motion flip/roll transition"
```

---

### Task 9: New Year sparkle overlay

**Files:**
- Create: `src/Sparkles.js`
- Modify: `pages/index.js`

**Interfaces:**
- Produces (`src/Sparkles.js`): default export `Sparkles()` (no props) — renders a fixed decorative particle layer using the `.sparkles`/`.spark` CSS already added in Task 6.

- [ ] **Step 1: Create `src/Sparkles.js`**

```jsx
import React, { useMemo } from 'react';

const SPARK_COUNT = 12;

function randomSparks() {
  return Array.from({ length: SPARK_COUNT }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    delay: `${(Math.random() * 3).toFixed(2)}s`,
    duration: `${(1.8 + Math.random() * 1.4).toFixed(2)}s`,
  }));
}

export default function Sparkles() {
  const sparks = useMemo(randomSparks, []);

  return (
    <div className="sparkles" aria-hidden="true">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="spark"
          style={{
            left: spark.left,
            top: spark.top,
            animationDelay: spark.delay,
            animationDuration: spark.duration,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire `Sparkles` into `pages/index.js`**

Replace the full file with:

```jsx
import React from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';
import AmbientGlow from '../src/AmbientGlow';
import Sparkles from '../src/Sparkles';
import useCountdownPhase from '../src/useCountdownPhase';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  const phase = useCountdownPhase();
  const isNewYearPhase = phase.isNewYearsEve || phase.isNewYear;

  return (
    <>
      <AmbientGlow isNewYearPhase={isNewYearPhase} />
      <Snowfall />
      {isNewYearPhase ? <Sparkles /> : null}
      <Countdown {...phase} />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

Run: `yarn dev` (in background). Use the webapp-testing skill's Playwright access to override the clock before navigating, so the app renders as if it were New Year's Eve one minute to midnight:

```js
await page.addInitScript(`{
  const fixed = new Date('2026-12-31T23:59:50Z').getTime();
  const OriginalDate = Date;
  class MockDate extends OriginalDate {
    constructor(...args) {
      super(...(args.length ? args : [fixed]));
    }
    static now() {
      return fixed;
    }
  }
  window.Date = MockDate;
}`);
await page.goto('http://localhost:3000');
```

Then screenshot. Expected: green glow palette, champagne icons, "Time Left Until New Year" label, and small gold spark bursts animating over the snow.

- [ ] **Step 4: Commit**

```bash
git add src/Sparkles.js pages/index.js
git commit -m "Add gold spark overlay during the New Year phase"
```

---

### Task 10: Docker build cache for the Next.js compiler

**Files:**
- Modify: `Dockerfile`

- [ ] **Step 1: Add a cache mount for `.next/cache` around the build step**

Change:

```dockerfile
RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache \
    YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn build
```

to:

```dockerfile
RUN --mount=type=cache,mode=0777,target=/root/.yarn/berry/cache \
    --mount=type=cache,mode=0777,target=/app/.next/cache \
    YARN_CACHE_FOLDER=/root/.yarn/berry/cache yarn build
```

(This is the second occurrence of that `RUN` block in the Dockerfile — the first `yarn install --immutable` block is untouched.)

- [ ] **Step 2: Verify**

Run: `cd /home/modem7/project/christmas-countdown && hadolint Dockerfile` (matches the `lint-dockerfile` step already in `.woodpecker.yml`; if `hadolint` isn't installed locally, run `docker run --rm -i hadolint/hadolint:latest-alpine < Dockerfile` instead).
Expected: no errors (warnings about pinned base image digests are pre-existing and out of scope).

Run: `docker build -t christmas-countdown:overhaul-test .`
Expected: build completes successfully (exit 0). This also validates every prior task's output together, since it builds the real production artifact from the exported static site.

- [ ] **Step 3: Commit**

```bash
git add Dockerfile
git commit -m "Cache Next.js build output in the Docker build stage"
```

---

### Task 11: Woodpecker CI registry build-cache export

**Files:**
- Modify: `.woodpecker.yml`

- [ ] **Step 1: Add `cache_to` alongside the existing `cache_from`**

In the `build-and-push` step's `settings`, change:

```yaml
      cache_from:
        - type=registry\,ref=modem7/christmas-countdown:latest
```

to:

```yaml
      cache_from:
        - type=registry\,ref=modem7/christmas-countdown:latest
      cache_to:
        - type=registry\,ref=modem7/christmas-countdown:buildcache\,mode=max
```

- [ ] **Step 2: Verify**

Run: `python3 -c "import yaml; yaml.safe_load(open('.woodpecker.yml'))" && echo "valid YAML"`
Expected: `valid YAML`.

- [ ] **Step 3: Commit**

```bash
git add .woodpecker.yml
git commit -m "Export full-layer build cache to a dedicated registry tag in CI"
```

---

### Task 12: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full static build**

Run: `cd /home/modem7/project/christmas-countdown && yarn lint && yarn build`
Expected: both exit 0.

- [ ] **Step 2: Default (Christmas-countdown) view**

Run `yarn dev` in the background, then use the webapp-testing skill to navigate to `http://localhost:3000` and take a screenshot.
Expected: no console errors, red glow palette, drifting ambient background, tree icons, flip-animated digits, "Time Left Until Christmas" label, no footer, no analytics network request (check via the skill's network-request inspection that nothing to `microanalytics.io` fires).

- [ ] **Step 3: Merry Christmas view**

Using the same `Date` mocking technique from Task 9's Step 3 (`page.addInitScript`), fix the date to `2026-12-25T12:00:00Z`, navigate, and screenshot.
Expected: "Merry Christmas!" headline in the Great Vibes script font, no digit row.

- [ ] **Step 4: New Year's Eve view**

Fix the date to `2026-12-31T23:59:50Z`, navigate, and screenshot.
Expected: green glow palette, champagne icons, gold sparks over the snow, digits counting down to midnight.

- [ ] **Step 5: Production Docker image smoke test**

Run:
```bash
docker run --rm -d -p 8080:8080 --name countdown-smoke christmas-countdown:overhaul-test
sleep 2
curl -fsS http://localhost:8080/ | grep -c "Yet Another Christmas Countdown"
docker stop countdown-smoke
```
Expected: the `curl`/`grep` prints a number ≥ 1, confirming the container serves the built page.

- [ ] **Step 6: Report**

No commit for this task — it's verification only. Summarize the results (pass/fail per step) for review before deciding on next steps (PR, etc.), which happen outside this plan.
