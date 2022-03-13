import React, { CSSProperties } from 'react';
import styles from './framer-animations.module.scss';
import { AnimatePresence, motion } from 'framer-motion';

export const FramerFadeInOut: React.FC<{
  visibleWhen: boolean;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className, visibleWhen, style }) => {
  return (
    <AnimatePresence>
      {visibleWhen && (
        <motion.div
          className={className ?? styles['transition-container']}
          style={style ?? {}}
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
