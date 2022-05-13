import React, { CSSProperties } from 'react';
import styles from './framer-animations.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { IChildrenProp } from '../../util';

export const FramerRollDown: React.FC<
  {
    visibleWhen: boolean;
    className?: string;
    style?: CSSProperties;
  } & IChildrenProp
> = ({ children, className, visibleWhen, style }) => {
  return (
    <AnimatePresence>
      {visibleWhen && (
        <motion.div
          className={className ?? styles['transition-container']}
          style={
            style
              ? { ...style, transformOrigin: 'top' }
              : { transformOrigin: 'top' }
          }
          initial={{ opacity: 0, scaleY: 0.1 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.1 }}
          transition={{ duration: 0.5, ease: 'easeIn' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
