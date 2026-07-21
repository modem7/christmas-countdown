import React from 'react';

import Countdown from '../src/Countdown';
import ReactiveSnow from '../src/ReactiveSnow';
import Sparkles from '../src/Sparkles';
import useCountdownPhase from '../src/useCountdownPhase';

export default function Index() {
  const phase = useCountdownPhase();
  const isNewYearPhase = phase.isNewYearsEve || phase.isNewYear;

  return (
    <>
      <ReactiveSnow />
      {isNewYearPhase ? <Sparkles /> : null}
      <Countdown {...phase} />
    </>
  );
}
