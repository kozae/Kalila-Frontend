import React from 'react';
import styles from './framer-animations.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

export const FramerFadeInOut: React.FC<{
  toggle: boolean;
  className?: string;
}> = ({ children, className, toggle }) => {
  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          className={className ?? styles['transition-container']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
