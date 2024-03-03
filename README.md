# Yet Another Christmas Countdown!

![Docker Pulls](https://img.shields.io/docker/pulls/modem7/christmas-countdown)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/modem7/christmas-countdown/latest)
[![Build Status](https://drone.modem7.com/api/badges/modem7/christmas-countdown/status.svg)](https://drone.modem7.com/modem7/christmas-countdown)
[![GitHub last commit](https://img.shields.io/github/last-commit/modem7/christmas-countdown)](https://github.com/modem7/christmas-countdown)

This is yet another Christmas Countdown website, built in React using Next.js. You can see it live [here](https://yetanotherchristmascountdown.com).

Original repo [here](https://github.com/plbrault/christmas-countdown/).

On December 31, it turns into a New Year countdown.

## Detailed Behaviour

* From January 2 to December 24: display the number of days, hours, minutes and seconds left until Christmas.
* On December 25: display "Merry Christmas!".
* From December 26 to December 30: display "Happy Holidays!".
* On December 31: display the number of hours, minutes and seconds left until New Year.
* On January 1: display "Happy New Year!".

## Usage

## Configuration

```bash
services:

  xmas:
    image: modem7/christmas-countdown
    container_name: Xmas-Countdown
    ports:
      - 8080:8080
```

# Tags
| Tag | Description |
| :----: | --- |
| Latest | Latest version |

## License

This project is [MIT licensed](https://github.com/plbrault/christmas-countdown/blob/main/LICENSE.txt).

## Font Licenses

This project uses fonts created by third parties and published under their own licenses. These licenses are available in the `font-licenses` folder of this repository.