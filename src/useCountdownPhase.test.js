import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { Settings } from 'luxon';

import useCountdownPhase from './useCountdownPhase';

beforeEach(() => {
  vi.useFakeTimers();
  Settings.defaultZone = 'utc';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Settings.defaultZone = 'system';
});

function allPhaseFlags(phase) {
  return {
    isBeforeChristmas: phase.isBeforeChristmas,
    isChristmas: phase.isChristmas,
    isHolidays: phase.isHolidays,
    isNewYearsEve: phase.isNewYearsEve,
    isNewYear: phase.isNewYear,
  };
}

describe('useCountdownPhase', () => {
  it('flags isBeforeChristmas, and only that flag, before December 25th', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 20, 10, 0, 0)));

    const { result } = renderHook(() => useCountdownPhase());

    expect(allPhaseFlags(result.current)).toEqual({
      isBeforeChristmas: true,
      isChristmas: false,
      isHolidays: false,
      isNewYearsEve: false,
      isNewYear: false,
    });
    expect(result.current.days).toBeGreaterThan(0);
  });

  it('flags isChristmas, and only that flag, on December 25th', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 25, 14, 0, 0)));

    const { result } = renderHook(() => useCountdownPhase());

    expect(allPhaseFlags(result.current)).toEqual({
      isBeforeChristmas: false,
      isChristmas: true,
      isHolidays: false,
      isNewYearsEve: false,
      isNewYear: false,
    });
  });

  it('flags isHolidays, and only that flag, during Dec 26-30', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 27, 12, 0, 0)));

    const { result } = renderHook(() => useCountdownPhase());

    expect(allPhaseFlags(result.current)).toEqual({
      isBeforeChristmas: false,
      isChristmas: false,
      isHolidays: true,
      isNewYearsEve: false,
      isNewYear: false,
    });
    expect(result.current.days).toBeGreaterThan(0);
  });

  it('flags isNewYearsEve, and only that flag, on December 31st', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 31, 23, 0, 0)));

    const { result } = renderHook(() => useCountdownPhase());

    expect(allPhaseFlags(result.current)).toEqual({
      isBeforeChristmas: false,
      isChristmas: false,
      isHolidays: false,
      isNewYearsEve: true,
      isNewYear: false,
    });
    expect(result.current.days).toBe(0);
  });

  it('flags isNewYear, and only that flag, on January 1st', () => {
    vi.setSystemTime(new Date(Date.UTC(2027, 0, 1, 3, 0, 0)));

    const { result } = renderHook(() => useCountdownPhase());

    expect(allPhaseFlags(result.current)).toEqual({
      isBeforeChristmas: false,
      isChristmas: false,
      isHolidays: false,
      isNewYearsEve: false,
      isNewYear: true,
    });
  });

  it('updates its values as time passes', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 24, 23, 59, 55)));

    const { result } = renderHook(() => useCountdownPhase());
    const initialSeconds = result.current.seconds;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).not.toBe(initialSeconds);
  });

  it('clears its interval on unmount', () => {
    vi.setSystemTime(new Date(Date.UTC(2026, 11, 20, 10, 0, 0)));
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useCountdownPhase());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
