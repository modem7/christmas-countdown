import React, { useEffect, useRef } from 'react';

const FLAKE_COUNT = 120;
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 1.4;

export default function ReactiveSnow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -9999, y: -9999 };

    const flakes = Array.from({ length: FLAKE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.5,
      vy: 0.3 + Math.random() * 0.7,
      vx: 0,
    }));

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function handleMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    let animationFrame;
    function tick() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      // Mutating each flake in place every frame (rather than allocating new
      // objects for 120 particles at 60fps) is the standard pattern for
      // canvas particle animation.
      /* eslint-disable no-param-reassign */
      flakes.forEach((flake) => {
        const dx = flake.x - mouse.x;
        const dy = flake.y - mouse.y;
        const dist = Math.sqrt((dx * dx) + (dy * dy));
        if (dist < REPEL_RADIUS) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          flake.vx += (dx / (dist || 1)) * force * REPEL_STRENGTH;
        }
        flake.vx *= 0.92;
        flake.x += flake.vx;
        flake.y += flake.vy;

        if (flake.y > height) {
          flake.y = -5;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
      });
      /* eslint-enable no-param-reassign */
      animationFrame = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    tick();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="reactive-snow" aria-hidden="true" />;
}
