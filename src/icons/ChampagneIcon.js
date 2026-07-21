import React from 'react';

export default function ChampagneIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M9.5 2 L10.5 11 A1.5 1.5 0 0 0 13.5 11 L14.5 2 Z" />
      <line x1="12" y1="11" x2="12" y2="19" />
      <line x1="8.5" y1="21" x2="15.5" y2="21" />
      <line x1="12" y1="19" x2="12" y2="21" />
      <circle cx="11.5" cy="8" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="6" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="11.8" cy="4.5" r="0.3" fill="currentColor" stroke="none" />
      <path d="M4 5 H5.5 M4.75 4.25 V5.75" strokeWidth="1" />
      <path d="M19.5 4 H21 M20.25 3.25 V4.75" strokeWidth="1" />
      <circle cx="5" cy="14" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="15" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
