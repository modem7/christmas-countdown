import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const digitVariants = {
  enter: { y: '-100%', opacity: 0 },
  center: { y: '0%', opacity: 1 },
  exit: { y: '100%', opacity: 0 },
};

export default function FlipDigit({ value }) {
  return (
    <span className="flip-digit">
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="flip-digit-value"
          variants={digitVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
