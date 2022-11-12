import styles from './nav.module.scss';
import React, { useEffect } from 'react';
import { NavMessageBar } from './nav-message-bar';
import { useNavSessionState, useRouteState } from './hooks/nav.hooks';
import { navbarInitialStore, NavbarStore } from './store';
import { useBoolean } from '../../../hooks';
import { NavPanel } from './nav-panel';
import { useRouter } from 'next/router';

export const Nav: React.FC = () => {
  const [
    isPanelOpen,
    { setTrue: openPanel, setFalse: dismissPanel, toggle: togglePanel },
  ] = useBoolean(navbarInitialStore.data.isPanelOpen);
  const { events } = useRouter();

  useEffect(() => {
    events.on('routeChangeStart', () => {
      dismissPanel();
    });
  }, []);

  const { activeLink } = useRouteState(navbarInitialStore.data, [dismissPanel]);
  const { links, loggedUser, isAdmin } = useNavSessionState(
    navbarInitialStore.data
  );
  return (
    <NavbarStore.Provider
      value={{
        data: {
          loggedUser,
          isAdmin,
          links,
          activeLink,
          isPanelOpen,
        },
        methods: {
          openPanel,
          dismissPanel,
          togglePanel,
        },
      }}
    >
      <nav className={styles['nav']}>
        <NavMessageBar />
        <NavPanel />
      </nav>
    </NavbarStore.Provider>
  );
};
