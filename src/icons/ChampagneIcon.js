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
      <path d="M9 2 L10 12 A2 2 0 0 0 14 12 L15 2 Z" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <path d="M4 6 L6 4 M20 6 L18 4 M4 12 L6 10" strokeWidth="1" />
    </svg>
  );
}
