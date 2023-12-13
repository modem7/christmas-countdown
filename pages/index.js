import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import Countdown from '../src/Countdown';

const Snowfall = dynamic({ loader: () => import('react-snowfall') },{ loading: () => <div></div>, ssr: false }) // eslint-disable-line

export default function Index() {
  const [year, setYear] = useState((new Date().getFullYear()));
  const [showFooter, setShowFotter] = useState(true);

  useEffect(() => {
    setYear((new Date().getFullYear()));
  });

  return (
    <>
      <Snowfall />
      <Countdown />
      {
        showFooter ? (
          <footer>
            <a href="https://plbrault.com">
              &copy;
              &nbsp;
              {year}
              &nbsp;
              P-L.Brault
            </a>
            <button type="button" className="hide-footer" onClick={() => setShowFotter(false)}>hide</button>
          </footer>
        ) : ''
      }
    </>
  );
}
