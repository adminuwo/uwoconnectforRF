'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  y = 30,
  x = 0,
  scale = 0.97,
  once = true,
  amount = 0.15,
  direction = 'up'
}) {
  let initialX = x;
  let initialY = y;

  if (direction === 'up') {
    initialY = y;
    initialX = 0;
  } else if (direction === 'down') {
    initialY = -y;
    initialX = 0;
  } else if (direction === 'left') {
    initialX = 35;
    initialY = 0;
  } else if (direction === 'right') {
    initialX = -35;
    initialY = 0;
  } else if (direction === 'fade') {
    initialX = 0;
    initialY = 0;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY, scale: direction === 'fade' ? 1 : scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

