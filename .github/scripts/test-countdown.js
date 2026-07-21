// Verifies the countdown actually renders the right phase for a given
// date, not just that the page returns 200 - this only exists client-side,
// driven by the date the browser's clock reports at load time. Each check
// mocks window.Date before navigation.
//
// The static export bakes in whatever the real date was at `docker build`
// time; the client then hydrates against a different (mocked, or just
// later-than-build-time) date. React surfaces that mismatch as a
// "Minified React error #418" pageerror even in production - but it's a
// *recoverable* hydration error: Next.js discards the mismatched markup
// and does a full client-side re-render, so by the time we read body text
// below the content is already correct (verified by the assertion right
// after). This is expected for any static export of time-sensitive
// content and isn't specific to this app, so it's filtered out here
// rather than treated as a failure - any other console error still fails
// the check.
const { chromium } = require('playwright');

const BASE_URL = process.argv[2] || 'http://localhost:8080';
const EXPECTED_HYDRATION_NOTICE = /Minified React error #418|Hydration failed/i;

function mockDateScript(isoString) {
  return `{
    const fixed = new Date(${JSON.stringify(isoString)}).getTime();
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
  }`;
}

async function checkPhase(browser, { label, isoDate, expectedText }) {
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !EXPECTED_HYDRATION_NOTICE.test(msg.text())) {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    const text = String(err);
    if (!EXPECTED_HYDRATION_NOTICE.test(text)) consoleErrors.push(text);
  });

  if (isoDate) {
    await page.addInitScript(mockDateScript(isoDate));
  }

  await page.goto(BASE_URL, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const bodyText = await page.locator('body').innerText();
  if (!bodyText.includes(expectedText)) {
    throw new Error(`[${label}] expected to find "${expectedText}" in page text, got:\n${bodyText}`);
  }

  if (consoleErrors.length > 0) {
    throw new Error(`[${label}] console errors detected:\n${consoleErrors.join('\n')}`);
  }

  await page.close();
  console.log(`OK: ${label}`);
}

async function main() {
  const browser = await chromium.launch();

  await checkPhase(browser, {
    label: 'default view shows the Christmas countdown label',
    isoDate: null,
    expectedText: 'Time Left Until Christmas',
  });

  await checkPhase(browser, {
    label: 'Christmas day shows Merry Christmas',
    isoDate: '2026-12-25T12:00:00Z',
    expectedText: 'Merry Christmas!',
  });

  await checkPhase(browser, {
    label: 'Happy Holidays window shows Happy Holidays',
    isoDate: '2026-12-27T12:00:00Z',
    expectedText: 'Happy Holidays!',
  });

  await checkPhase(browser, {
    label: "New Year's Eve shows the New Year countdown label",
    isoDate: '2026-12-31T23:59:50Z',
    expectedText: 'Time Left Until New Year',
  });

  await checkPhase(browser, {
    label: "New Year's Day shows Happy New Year",
    isoDate: '2027-01-01T08:00:00Z',
    expectedText: 'Happy New Year!',
  });

  await browser.close();
  console.log('Countdown phase test passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
