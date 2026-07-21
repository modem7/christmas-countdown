import React from 'react';

export default function TreeIcon(props) {
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
      <path d="M12 2 L6 10 H9 L4 17 H20 L15 10 H18 Z" />
      <line x1="12" y1="17" x2="12" y2="22" />
    </svg>
  );
}
