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
