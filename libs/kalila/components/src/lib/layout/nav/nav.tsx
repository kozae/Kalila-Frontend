import styles from './nav.module.scss';
import { FC, useEffect } from 'react';
import { NavTopBar } from './nav-top-bar';
import { useNavSessionState, useRouteState } from './hooks/nav.hooks';
import { navbarInitialStore, NavbarStore } from './store';
import { NavPanel } from './nav-panel';
import { useRouter } from 'next/router';
import { ISession, useBoolean } from '@frontend/util';

export const Nav: FC<{
  authenticated: boolean;
  session: ISession | null;
}> = ({ authenticated, session }) => {
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
    navbarInitialStore.data,
    authenticated,
    session
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
        <NavTopBar />
        <NavPanel />
      </nav>
    </NavbarStore.Provider>
  );
};
