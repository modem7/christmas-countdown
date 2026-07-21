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
      <path d="M12 0.5 V3 M10.5 1.75 H13.5" strokeWidth="1" />
      <path d="M12 2 L9 6.5 H15 Z" />
      <path d="M12 5.5 L7 11 H17 Z" />
      <path d="M12 9.5 L5 17 H19 Z" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <circle cx="10" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="14" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
