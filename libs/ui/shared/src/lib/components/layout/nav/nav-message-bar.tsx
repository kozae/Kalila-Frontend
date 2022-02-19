import React, { useContext } from 'react';
import styles from './nav.module.scss';
import { motion } from 'framer-motion';
import LinearProgress from '@mui/material/LinearProgress';
import { FramerFadeInOut, NavMessageBarContext } from '@frontend/shared-ui';
import { ManuscriptPagesPaginator } from './command-bars';
import { stringHasValue } from '@frontend/util';

export const NavMessageBar: React.FC = () => {
  const { messages, color, commandBar } = useContext(NavMessageBarContext);

  return (
    <div
      style={{ backgroundColor: color }}
      className={styles['nav__message-bar']}
    >
      <div className={styles['nav__message-bar__contents']}>
        {!messages[0] && (
          <div className={styles['nav__message-bar__progress-indicator']}>
            <LinearProgress />
          </div>
        )}
        {messages[0] && (
          <motion.p
            className={styles['nav__message-bar__main']}
            key={0}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            {messages[0]}
          </motion.p>
        )}
        {messages[1] && (
          <motion.p
            className={styles['nav__message-bar__secondary']}
            key={1}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            {messages[1]}
          </motion.p>
        )}
        <FramerFadeInOut
          toggle={
            stringHasValue(messages[0]) &&
            commandBar !== undefined &&
            commandBar.name === 'manuscript-pages-paginator'
          }
          className={
            styles['nav__message-bar__command-bar__transition-container']
          }
        >
          {/*@ts-ignore*/}
          <ManuscriptPagesPaginator {...commandBar?.data} />
        </FramerFadeInOut>
      </div>
    </div>
  );
};
