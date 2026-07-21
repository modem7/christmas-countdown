import React from 'react';

import TreeIcon from './icons/TreeIcon';
import ChampagneIcon from './icons/ChampagneIcon';
import FlipDigit from './FlipDigit';

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

function FlipNumber({ value }) {
  return value.split('').map((digit, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <FlipDigit key={index} value={digit} />
  ));
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
                    <FlipNumber value={String(days).padStart(2, '0')} />
                    &nbsp;days&nbsp;
                  </>
                ) : ''
              }
              <FlipNumber value={String(hours).padStart(2, '0')} />
              &nbsp;hours&nbsp;
              <FlipNumber value={String(minutes).padStart(2, '0')} />
              &nbsp;minutes&nbsp;
              <FlipNumber value={String(seconds).padStart(2, '0')} />
              &nbsp;seconds
            </>
          ) : (<>&nbsp;</>)
        }
      </div>
      <Icons isNewYearPhase={isNewYearPhase} />
    </div>
  );
}
