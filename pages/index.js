import React from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';
import useCountdownPhase from '../src/useCountdownPhase';

const Snowfall = dynamic({ loader: () => import('react-snowfall') }, { loading: () => <div></div>, ssr: false }); // eslint-disable-line

export default function Index() {
  const phase = useCountdownPhase();

  return (
    <>
      <Snowfall />
      <Countdown {...phase} />
    </>
  );
}
