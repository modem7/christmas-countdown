import React from 'react';

import TreeIcon from './icons/TreeIcon';
import ChampagneIcon from './icons/ChampagneIcon';

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
                    <span className="number">{String(days).padStart(2, '0')}</span>
                    &nbsp;days&nbsp;
                  </>
                ) : ''
              }
              <span className="number">{String(hours).padStart(2, '0')}</span>
              &nbsp;hours&nbsp;
              <span className="number">{String(minutes).padStart(2, '0')}</span>
              &nbsp;minutes&nbsp;
              <span className="number">{String(seconds).padStart(2, '0')}</span>
              &nbsp;seconds
            </>
          ) : (<>&nbsp;</>)
        }
      </div>
      <Icons isNewYearPhase={isNewYearPhase} />
    </div>
  );
}
