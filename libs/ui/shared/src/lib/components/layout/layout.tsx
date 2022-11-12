import styles from './layout.module.scss';
import React from 'react';
import { Nav } from './nav';
import {
  selectAccessToken,
  selectMaxWidthIsEnabled,
  useAppSelector,
  useKalilaSession,
} from '../../store';
import { IChildrenProp } from '../../util';
import { useAccessTokenValidation } from '../../hooks';

export const siteMaxWidth = '1600px';
export const sitePadding = '0 1rem 0 1rem';

export const Layout: React.FC<IChildrenProp> = ({ children }) => {
  useKalilaSession();
  const enableMaxWidth = useAppSelector(selectMaxWidthIsEnabled);
  const accessToken = useAppSelector(selectAccessToken);
  useAccessTokenValidation(accessToken);
  return (
    <>
      <Nav />
      <div className={styles['kalila']}>
        <main
          style={{
            maxWidth: enableMaxWidth ? '100%' : siteMaxWidth,
            padding: enableMaxWidth ? '0' : sitePadding,
          }}
          className={styles['main']}
        >
          {children}
        </main>
      </div>
    </>
  );
};
