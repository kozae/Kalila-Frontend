import styles from './layout.module.scss';
import React from 'react';
import { Nav } from './nav';
import { useKalilaSession } from '@frontend/ui/store';

export const Layout: React.FC = ({ children }) => {
  useKalilaSession();
  return (
    <>
      <Nav />
      <div className={styles['kalila']}>
        <main className={styles['main']}>{children}</main>
      </div>
    </>
  );
};
