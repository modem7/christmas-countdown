import React, { useMemo } from 'react';

const SPARK_COUNT = 12;

function randomSparks() {
  return Array.from({ length: SPARK_COUNT }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    delay: `${(Math.random() * 3).toFixed(2)}s`,
    duration: `${(1.8 + Math.random() * 1.4).toFixed(2)}s`,
  }));
}

export default function Sparkles() {
  const sparks = useMemo(randomSparks, []);

  return (
    <div className="sparkles" aria-hidden="true">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="spark"
          style={{
            left: spark.left,
            top: spark.top,
            animationDelay: spark.delay,
            animationDuration: spark.duration,
          }}
        />
      ))}
    </div>
  );
}
