import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import getTimeToNextEvent from './getTimeToNextEvent';

const Emojis = ({ isNewYear, isNewYearsEve }) => (
  <Box className="emojis">
    {(isNewYear || isNewYearsEve) ? '🍾🍾🍾' : '🎄🎄🎄'}
  </Box>
);

export default function Countdown() {
  const [timeToNextEvent, setTimeToNextEvent] = useState(getTimeToNextEvent());

  useEffect(() => {
    setInterval(() => {
      const newTimeToNextEvent = getTimeToNextEvent();
      setTimeToNextEvent(newTimeToNextEvent);
    }, 100); // interval of 100 instead of 1000 to minimize drift
  }, []);

  const {
    nextEvent, days, hours, minutes, seconds, totalSeconds,
  } = timeToNextEvent;

  const isBeforeChristmas = (nextEvent === 'CHRISTMAS' && totalSeconds > 0);
  const isChristmas = (nextEvent === 'CHRISTMAS' && totalSeconds === 0);
  const isHolidays = (nextEvent === 'NEW_YEAR' && days > 0);
  const isNewYearsEve = (nextEvent === 'NEW_YEAR' && days === 0 && totalSeconds > 0);
  const isNewYear = (nextEvent === 'NEW_YEAR' && totalSeconds === 0);

  return (
    <Stack
      className={`countdown-container ${(isNewYearsEve || isNewYear) ? 'new-year' : ''}`}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box className="label">
        {isBeforeChristmas ? 'Time Left Until Christmas' : ''}
        {isNewYearsEve ? 'Time Left Until New Year' : ''}
      </Box>
      <Emojis isNewYear={isNewYear} isNewYearsEve={isNewYearsEve} />
      <span className="text-during-event">
        {isChristmas ? 'Merry Christmas!' : ''}
        {isHolidays ? 'Happy Holidays!' : ''}
        {isNewYear ? 'Happy New Year!' : ''}
      </span>
      <Box className="time-before-next-event">
        {
          (isBeforeChristmas || isNewYearsEve) ? (
            <>
              {
                (nextEvent === 'CHRISTMAS') ? (
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
          ) : (<> </>)
        }
      </Box>
      <Emojis isNewYear={isNewYear} isNewYearsEve={isNewYearsEve} />
    </Stack>
  );
}
