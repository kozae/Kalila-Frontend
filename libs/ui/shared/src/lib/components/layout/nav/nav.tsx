import styles from './nav.module.scss';
import React from "react";
import {NavControlBar} from "./nav-control-bar";
import {NavMessageBar} from "./nav-message-bar";
import {useBoolean} from "@fluentui/react-hooks";
import {SidePanel} from "./side-panel";
import {useNavSessionState, useRouteState} from "./hooks/nav.hooks";
import {navbarInitialStore, NavbarStore} from "./store";


export const Nav: React.FC = () => {
  const [isPanelOpen, {setTrue: openPanel, setFalse: dismissPanel}] = useBoolean(navbarInitialStore.state.isPanelOpen);
  const {activeLink, messages} = useRouteState(navbarInitialStore.state, [dismissPanel])
  const {links, loggedUser, isAdmin} = useNavSessionState(navbarInitialStore.state)

  return (
    <NavbarStore.Provider value={{
      state: {
        loggedUser,
        isAdmin,
        links,
        activeLink,
        messages,
        isPanelOpen,
      },
      dispatchers: {
        openPanel,
        dismissPanel
      }
    }}>
      <nav className={styles['nav']}>
        <NavControlBar/>
        <NavMessageBar/>
        <SidePanel/>
      </nav>
    </NavbarStore.Provider>
  );
}


