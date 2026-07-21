import React from 'react';
import {
  afterEach, describe, expect, it,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import Countdown from './Countdown';

const TREE_PATH = 'M12 2 L9 6.5 H15 Z';
const CHAMPAGNE_PATH = 'M9.5 2 L10.5 11 A1.5 1.5 0 0 0 13.5 11 L14.5 2 Z';

const basePhase = {
  isBeforeChristmas: false,
  isChristmas: false,
  isHolidays: false,
  isNewYearsEve: false,
  isNewYear: false,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

afterEach(cleanup);

describe('Countdown', () => {
  it('renders the Christmas countdown with tree icons and an accessible digit summary', () => {
    const { container } = render(
      <Countdown
        {...basePhase}
        isBeforeChristmas
        days={5}
        hours={3}
        minutes={2}
        seconds={1}
      />,
    );

    expect(screen.getByText('Time Left Until Christmas')).toBeInTheDocument();
    expect(container.querySelector(`.icon-row path[d="${TREE_PATH}"]`)).not.toBeNull();
    expect(container.querySelector(`.icon-row path[d="${CHAMPAGNE_PATH}"]`)).toBeNull();
    expect(container.querySelector('.countdown-container.new-year')).toBeNull();

    const srOnly = container.querySelector('.time-before-next-event .sr-only');
    expect(srOnly).not.toBeNull();
    expect(srOnly.textContent).toBe('5 days 3 hours 2 minutes 1 seconds');

    const visualDigits = container.querySelector('.time-before-next-event > span[aria-hidden="true"]');
    expect(visualDigits.querySelectorAll('.flip-digit')).toHaveLength(8); // 2 digits x 4 units
  });

  it('shows "Merry Christmas!" with no digit row on Christmas day', () => {
    const { container } = render(<Countdown {...basePhase} isChristmas />);

    expect(screen.getByText('Merry Christmas!')).toBeInTheDocument();
    expect(container.querySelector('.time-before-next-event .sr-only')).toBeNull();
    expect(container.querySelectorAll('.flip-digit')).toHaveLength(0);
    expect(container.querySelector(`.icon-row path[d="${TREE_PATH}"]`)).not.toBeNull();
  });

  it('shows "Happy Holidays!" with tree icons during Dec 26-30', () => {
    const { container } = render(<Countdown {...basePhase} isHolidays />);

    expect(screen.getByText('Happy Holidays!')).toBeInTheDocument();
    expect(container.querySelector(`.icon-row path[d="${TREE_PATH}"]`)).not.toBeNull();
    expect(container.querySelector('.countdown-container.new-year')).toBeNull();
  });

  it('renders the New Year countdown with champagne icons and no days unit', () => {
    const { container } = render(
      <Countdown
        {...basePhase}
        isNewYearsEve
        hours={0}
        minutes={1}
        seconds={30}
      />,
    );

    expect(screen.getByText('Time Left Until New Year')).toBeInTheDocument();
    expect(container.querySelector(`.icon-row path[d="${CHAMPAGNE_PATH}"]`)).not.toBeNull();
    expect(container.querySelector('.countdown-container.new-year')).not.toBeNull();

    const srOnly = container.querySelector('.time-before-next-event .sr-only');
    expect(srOnly.textContent).toBe('0 hours 1 minutes 30 seconds');
    expect(container.querySelectorAll('.flip-digit')).toHaveLength(6); // 2 digits x 3 units, no days
  });

  it('shows "Happy New Year!" with champagne icons and no digit row on New Year\'s Day', () => {
    const { container } = render(<Countdown {...basePhase} isNewYear />);

    expect(screen.getByText('Happy New Year!')).toBeInTheDocument();
    expect(container.querySelector(`.icon-row path[d="${CHAMPAGNE_PATH}"]`)).not.toBeNull();
    expect(container.querySelector('.countdown-container.new-year')).not.toBeNull();
    expect(container.querySelectorAll('.flip-digit')).toHaveLength(0);
  });
});
