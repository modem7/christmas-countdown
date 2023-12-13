import { DateTime, Interval } from 'luxon';

function getTimeToEvent(now, event) {
  const interval = Interval.fromDateTimes(now, event);
  const duration = interval.toDuration(['days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject();

  if (duration.milliseconds > 0) {
    if (duration.seconds < 59) {
      duration.seconds += 1;
    } else {
      duration.minutes += 1;
      duration.seconds = 0;
    }
  }

  duration.totalSeconds = event - now;

  return duration;
}

/**
  * @returns {nextEvent, days, hours, minutes, seconds, milliseconds, totalSeconds}
  * nextEvent is either "CHRISTMAS" or "NEW_YEAR".
  * If current date is December 25th or January 1st, returns all 0's.
 */
function getTimeToNextEvent() {
  const now = DateTime.now();
  const currentYear = now.year;

  let result;

  if (now.month === 12 && now.day === 25) {
    result = {
      nextEvent: 'CHRISTMAS', days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalSeconds: 0,
    };
  } else if (now.month === 12 && now.day > 25) {
    const newYear = DateTime.local(currentYear + 1, 1, 1, 0, 0, 0);
    result = { nextEvent: 'NEW_YEAR', ...getTimeToEvent(now, newYear) };
  } else if (now.month === 1 && now.day === 1) {
    result = {
      nextEvent: 'NEW_YEAR', days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, totalSeconds: 0,
    };
  } else {
    const christmas = DateTime.local(currentYear, 12, 25, 0, 0, 0);
    result = { nextEvent: 'CHRISTMAS', ...getTimeToEvent(now, christmas) };
  }

  return result;
}

export default getTimeToNextEvent;
