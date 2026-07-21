# Christmas Countdown Overhaul — Design

Date: 2026-07-21

## Background

`modem7/christmas-countdown` is not a true GitHub fork of `plbrault/christmas-countdown`
(no shared git history / merge base), but a feature-equivalent reimplementation that has
kept pace independently. A commit-by-commit comparison against `upstream/main` confirms
every upstream feature is already present: the New Year countdown, the "Happy Holidays"
period (Dec 26–30), the 100ms-interval accurate timer, the gradient background, responsive
text sizing, and snowfall. There is nothing left to port from upstream — this project is
instead a from-scratch visual and technical overhaul of the existing app.

## Goals

1. Remove third-party analytics and the on-page author-attribution footer.
2. Update licensing to reflect the new maintainer's contribution.
3. Fully modernize the visual design: typography, color, motion, and effects.
4. Improve Docker/CI build caching.

## Non-goals

- No new pages, routes, or features beyond the existing Christmas/Holidays/New Year
  countdown behavior — behavior described in `README.md`'s "Detailed Behaviour" section
  is preserved exactly.
- No test framework is being introduced (none exists today).
- No change to the static-export (`next export`) deployment model, hosting, or domain.

## 1. Cleanup

- Remove the Microanalytics `<script>` tag from `pages/_app.js` (line ~40).
- Remove the "© {year} P-L.Brault" footer — the link, the "hide" button, and the
  `showFooter` state — from `pages/index.js`. Remove the corresponding `footer` /
  `.hide-footer` rules from `css/main.css`.
- `LICENSE.txt` is **not** deleted — see §5 License below.
- The "Original repo" credit line in `README.md` stays (documentation-level attribution,
  not on-page UI).

## 2. Dependency changes

**Remove:** `@mui/material`, `@emotion/cache`, `@emotion/react`, `@emotion/server`,
`@emotion/styled`, `clsx` (already unused), `prop-types` (only used for MUI-adjacent
prop validation in `_app.js`, which goes away with MUI).

**Add:** `framer-motion` (digit flip animation, transitions).

**Fonts:** move from manually-hosted `.ttf` + hand-written `@font-face` rules
(`css/fonts.css`, `public/fonts/*.ttf`, `font-licenses/*`) to `next/font/google`,
which self-hosts at build time with zero layout shift and no separate license-file
bookkeeping. New pairing:

- **Space Grotesk** (bold, tabular figures) — countdown numbers and labels. Modern,
  geometric, and tabular figures keep digit width stable for the flip animation.
- **Great Vibes** (flowing script) — "Merry Christmas!" / "Happy New Year!" headline
  text. Real neon signage is almost always cursive; this sells the glow effect better
  than a blocky font would.

`css/fonts.css`, `public/fonts/`, and `font-licenses/` are deleted as part of this
migration.

**Consequence for `_document.js`:** with MUI/Emotion gone, the entire Emotion SSR
extraction block (`createEmotionServer`, `getInitialProps` override) is removed.
`_document.js` becomes a plain static `Html`/`Head`/`body` document with just the
`theme-color` meta tag (value inlined as a constant, since `src/theme.js` also goes
away with MUI).

## 3. Visual redesign

**Palette:** keep the existing red (Christmas) / green (New Year) distinction, but
deepen and saturate both into neon-viable tones — crimson (`#ff2d55`-ish) and emerald
(`#39ff88`-ish) — against a darkened version of the current black → `#070026`
gradient background.

**Glow:** `text-shadow` bloom on the headline and countdown numbers. Two large, soft,
blurred radial-gradient "ambient light" shapes sit behind the countdown and drift
slowly via CSS animation (no new dependency).

**Number animation:** each digit is its own flip/roll unit built with Framer Motion's
`AnimatePresence`, keyed on the digit's value — the outgoing digit slides/rotates out
as the incoming one slides in, odometer-style. Applies to days/hours/minutes/seconds.

**Icons:** the 🎄🎄🎄 / 🍾🍾🍾 emoji rows are replaced with two small custom inline
SVGs (a line-art tree, a champagne+confetti glyph), styled with the same glow
treatment as the surrounding text so they read as part of one system rather than
platform emoji pasted on top.

**Snow:** `react-snowfall` keeps running continuously. During the New Year / New
Year's Eve phase (`isNewYearsEve || isNewYear`), a handful of CSS-animated gold
spark/firework-burst particles layer in alongside the snow — no new dependency.

**Component structure:** `Countdown.js` and `Index.js` are rewritten to plain
JSX/CSS (no MUI `Box`/`Stack`); `theme.js` is removed since there's no MUI
`ThemeProvider` to configure.

## 4. Docker/CI build improvements

- `Dockerfile`: add `RUN --mount=type=cache,mode=0777,target=/app/.next/cache` around
  the `yarn build` step, so unchanged builds reuse Next's compiler cache in addition
  to the existing yarn cache mounts.
- `.woodpecker.yml`: add `cache_to: type=registry,ref=modem7/christmas-countdown:buildcache,mode=max`
  alongside the existing `cache_from`, so all layers are cached (not just what's
  reachable from the `:latest` tag via inline cache) — more reliable cache hits across
  the `linux/amd64` / `linux/arm64` matrix.
- No other changes: the multi-stage build, unprivileged nginx runtime, `.dockerignore`
  scope, and dependency-before-source layer ordering are already solid.

## 5. License

`LICENSE.txt` becomes a dual-copyright MIT notice, reflecting that Pier-Luc Brault
holds copyright on the original work and Alex Lane holds copyright on the
redesign/modifications, rather than replacing the original notice outright (MIT
requires the original notice be preserved in derivative works):

```
Copyright (c) 2021 Pier-Luc Brault <pier-luc@brault.me>
Copyright (c) 2026 Alex Lane

Permission is hereby granted, free of charge, to any person obtaining a copy
...
```
(rest of MIT text unchanged)

## Risks / open questions

- `next/font/google` requires network access to Google Fonts at build time (or a
  vendored fallback) — the existing self-hosted `.ttf` approach had no such
  requirement. Given the Dockerfile already runs `yarn install`/`yarn build` with
  network access available in CI, this is not expected to be a problem, but is worth
  flagging as a build-environment dependency that didn't exist before.
- Dropping MUI/Emotion changes the production bundle meaningfully (smaller); no
  behavior beyond visual/animation is expected to change.
