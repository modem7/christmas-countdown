import React from 'react';

export default function AmbientGlow({ isNewYearPhase }) {
  return (
    <div className={`ambient-glow ${isNewYearPhase ? 'new-year' : ''}`} aria-hidden="true">
      <span className="ambient-glow-blob ambient-glow-blob--one" />
      <span className="ambient-glow-blob ambient-glow-blob--two" />
    </div>
  );
}
