import {
  afterEach, describe, expect, it,
} from 'vitest';
import { DateTime, Settings } from 'luxon';

import getTimeToNextEvent from './getTimeToNextEvent';

function mockNow(dateTime) {
  Settings.defaultZone = 'utc';
  Settings.now = () => dateTime.toMillis();
}

afterEach(() => {
  Settings.now = () => Date.now();
  Settings.defaultZone = 'system';
});

describe('getTimeToNextEvent', () => {
  it('counts down to Christmas with no sub-second remainder', () => {
    const now = DateTime.utc(2026, 12, 20, 10, 0, 0);
    const christmas = DateTime.utc(2026, 12, 25, 0, 0, 0);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('CHRISTMAS');
    expect(result.days).toBe(4);
    expect(result.hours).toBe(14);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.totalSeconds).toBe(christmas.toMillis() - now.toMillis());
  });

  it('bumps seconds up by one when a sub-second remainder exists (seconds < 59)', () => {
    // 1.5 seconds before Christmas
    const now = DateTime.utc(2026, 12, 24, 23, 59, 58, 500);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('CHRISTMAS');
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(2);
  });

  it('rolls seconds=59 with a sub-second remainder into the next minute', () => {
    // 59.5 seconds before Christmas
    const now = DateTime.utc(2026, 12, 24, 23, 59, 0, 500);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('CHRISTMAS');
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(0);
  });

  it('shows all zeros for the entire day of December 25th, regardless of time', () => {
    const now = DateTime.utc(2026, 12, 25, 14, 32, 9);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result).toEqual({
      nextEvent: 'CHRISTMAS', days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalSeconds: 0,
    });
  });

  it('counts down to New Year during the "Happy Holidays" window (Dec 26-30)', () => {
    const now = DateTime.utc(2026, 12, 26, 12, 0, 0);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('NEW_YEAR');
    expect(result.days).toBeGreaterThan(0);
    expect(result.totalSeconds).toBeGreaterThan(0);
  });

  it('counts down to New Year with zero days remaining on New Year\'s Eve', () => {
    const now = DateTime.utc(2026, 12, 31, 23, 59, 50);
    const newYear = DateTime.utc(2027, 1, 1, 0, 0, 0);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('NEW_YEAR');
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(10);
    expect(result.totalSeconds).toBe(newYear.toMillis() - now.toMillis());
  });

  it('shows all zeros for the entire day of January 1st, regardless of time', () => {
    const now = DateTime.utc(2027, 1, 1, 8, 15, 0);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result).toEqual({
      nextEvent: 'NEW_YEAR', days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalSeconds: 0,
    });
  });

  it('targets Christmas of the same year once January has moved past New Year\'s Day', () => {
    const now = DateTime.utc(2027, 1, 2, 0, 0, 0);
    const christmasSameYear = DateTime.utc(2027, 12, 25, 0, 0, 0);
    mockNow(now);

    const result = getTimeToNextEvent();

    expect(result.nextEvent).toBe('CHRISTMAS');
    expect(result.totalSeconds).toBe(christmasSameYear.toMillis() - now.toMillis());
  });
});
