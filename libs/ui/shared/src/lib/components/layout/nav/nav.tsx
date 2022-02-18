import styles from './nav.module.scss';
import React from 'react';
import { NavControlBar } from './nav-control-bar';
import { NavMessageBar } from './nav-message-bar';
import { SidePanel } from './side-panel';
import { useNavSessionState, useRouteState } from './hooks/nav.hooks';
import { navbarInitialStore, NavbarStore } from './store';
import { useBoolean } from '../../../hooks';

export const Nav: React.FC = () => {
  const [isPanelOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(navbarInitialStore.data.isPanelOpen);
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
        },
      }}
    >
      <nav className={styles['nav']}>
        <NavControlBar />
        <NavMessageBar />
        <SidePanel />
      </nav>
    </NavbarStore.Provider>
  );
};
