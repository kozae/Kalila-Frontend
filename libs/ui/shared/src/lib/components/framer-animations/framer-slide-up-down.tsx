import React from 'react';
import styles from './framer-animations.module.scss';
import { motion } from 'framer-motion';

export const FramerSlideUpDown: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={className ?? styles['transition-container']}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
    >
      {children}
    </motion.div>
  );
};
