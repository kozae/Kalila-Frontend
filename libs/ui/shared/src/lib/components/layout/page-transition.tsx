import React from 'react';
import { motion } from 'framer-motion';
import styles from './layout.module.scss';

export const withTransition = (
  OriginalComponent: React.JSXElementConstructor<any>,
  extraProps: any,
  className: string | undefined = undefined
) => {
  return (props: any) => {
    const merge = { ...props, ...extraProps };
    return (
      <motion.div
        className={className ?? styles['transition-container']}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      >
        <OriginalComponent {...merge} />
      </motion.div>
    );
  };
};
