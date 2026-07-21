import React from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';
import AmbientGlow from '../src/AmbientGlow';
import useCountdownPhase from '../src/useCountdownPhase';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  const phase = useCountdownPhase();
  const isNewYearPhase = phase.isNewYearsEve || phase.isNewYear;

  return (
    <>
      <AmbientGlow isNewYearPhase={isNewYearPhase} />
      <Snowfall />
      <Countdown {...phase} />
    </>
  );
}
