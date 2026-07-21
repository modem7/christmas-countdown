# Yet Another Christmas Countdown!

A self-hosted, self-contained countdown to Christmas — and then to New Year's
— with a neon-glow design, animated flip-style digits, and a drifting
ambient background. No ads, no analytics, no social icons, just the
countdown.

[![status-badge](https://woodpecker.modem7.com/api/badges/7/status.svg?events=push%2Cmanual)](https://woodpecker.modem7.com/repos/7)
[![CI](https://github.com/modem7/christmas-countdown/actions/workflows/CI.yml/badge.svg)](https://github.com/modem7/christmas-countdown/actions/workflows/CI.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/modem7/christmas-countdown)](https://hub.docker.com/r/modem7/christmas-countdown)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/modem7/christmas-countdown/latest)](https://hub.docker.com/r/modem7/christmas-countdown)
[![GitHub last commit](https://img.shields.io/github/last-commit/modem7/christmas-countdown)](https://github.com/modem7/christmas-countdown/commits/master)

## Quick start

```bash
docker run -d --name christmas-countdown -p 8080:8080 modem7/christmas-countdown
```

Or Compose, if that's more your thing:

```yaml
services:
  xmas:
    image: modem7/christmas-countdown
    container_name: Xmas-Countdown
    ports:
      - 8080:8080
```

Open `http://localhost:8080` and enjoy.

## Detailed behaviour

* From January 2 to December 24: displays the number of days, hours, minutes and seconds left until Christmas.
* On December 25: displays "Merry Christmas!".
* From December 26 to December 30: displays "Happy Holidays!".
* On December 31: displays the number of hours, minutes and seconds left until New Year, with a green palette, champagne icons, and a gold spark overlay in place of the Christmas theme.
* On January 1: displays "Happy New Year!".

## What's actually in the image

- Static export from Next.js — fonts (Space Grotesk / Great Vibes) and countdown logic are baked in at build time via `next build`, no server-side runtime
- Served by `nginxinc/nginx-unprivileged`, runs as a non-root user
- Multi-arch: `amd64`, `arm64/v8`

## Testing / CI

`yarn lint` and `yarn test` (Vitest — countdown date logic, phase derivation,
and component rendering) run in
[GitHub Actions](.github/workflows/CI.yml) on every push and PR, alongside a
Dockerfile build check.

`.woodpecker.yml` does the actual multi-arch build and Docker Hub push,
triggered automatically on push to `master` (or manually, for on-demand
rebuilds).

## Tags

| Tag | Description |
| :----: | --- |
| `latest` | Latest version |

## Credits

Originally based on [plbrault/christmas-countdown](https://github.com/plbrault/christmas-countdown/), since substantially redesigned.

## License

MIT, see [LICENSE.txt](LICENSE.txt).
