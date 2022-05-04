import styles from './layout.module.scss';
import React from 'react';
import { Nav } from './nav';
import { useKalilaSession } from '../../store';
import { IChildrenProp } from '../../util';

export const Layout: React.FC<IChildrenProp> = ({ children }) => {
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
