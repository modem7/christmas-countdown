import React from 'react';

import TreeIcon from './icons/TreeIcon';
import ChampagneIcon from './icons/ChampagneIcon';
import FlipDigit from './FlipDigit';

function Icons({ isNewYearPhase }) {
  const Icon = isNewYearPhase ? ChampagneIcon : TreeIcon;
  const modifierClass = isNewYearPhase ? 'event-icon--champagne' : 'event-icon--tree';
  return (
    <span className="icon-row">
      <Icon className={`event-icon ${modifierClass}`} />
      <Icon className={`event-icon ${modifierClass}`} />
      <Icon className={`event-icon ${modifierClass}`} />
    </span>
  );
}

function FlipNumber({ value }) {
  return value.split('').map((digit, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <FlipDigit key={index} value={digit} />
  ));
}

function accessibleCountdownText({
  isBeforeChristmas, isNewYearsEve, days, hours, minutes, seconds,
}) {
  if (isBeforeChristmas) {
    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
  if (isNewYearsEve) {
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
  return '';
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
              <span className="sr-only">
                {accessibleCountdownText({
                  isBeforeChristmas, isNewYearsEve, days, hours, minutes, seconds,
                })}
              </span>
              <span className="digit-row" aria-hidden="true">
                {
                  isBeforeChristmas ? (
                    <span className="digit-unit">
                      <FlipNumber value={String(days).padStart(2, '0')} />
                      &nbsp;days
                    </span>
                  ) : null
                }
                <span className="digit-unit">
                  <FlipNumber value={String(hours).padStart(2, '0')} />
                  &nbsp;hours
                </span>
                <span className="digit-unit">
                  <FlipNumber value={String(minutes).padStart(2, '0')} />
                  &nbsp;minutes
                </span>
                <span className="digit-unit">
                  <FlipNumber value={String(seconds).padStart(2, '0')} />
                  &nbsp;seconds
                </span>
              </span>
            </>
          ) : (<>&nbsp;</>)
        }
      </div>
      <Icons isNewYearPhase={isNewYearPhase} />
    </div>
  );
}
