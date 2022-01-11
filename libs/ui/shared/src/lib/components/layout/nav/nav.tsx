import styles from './nav.module.scss';
import React from "react";
import {INavbarLink} from "../../../constants";
import {NavControlBar} from "./nav-control-bar";
import {NavMessageBar} from "./nav-message-bar";
import {useBoolean} from "@fluentui/react-hooks";
import {SidePanel} from "./side-panel";
import {useSessionState, useRouteState} from "./hooks/nav.hooks";

export interface INavbarState {
  loggedUser?: string | null,
  isAdmin: boolean,
  activeLink: string,
  links: INavbarLink[],
  messages: [string | undefined, string | undefined],
  isPanelOpen: boolean,
  openPanel: () => void,
  dismissPanel: () => void,
}

export const navbarInitialState: INavbarState = {
  isAdmin: false,
  activeLink: '/',
  links: [],
  messages: ['Home', undefined],
  isPanelOpen: false,
  openPanel: () => {
  },
  dismissPanel: () => {
  },
}

export const NavbarContext = React.createContext<INavbarState>(navbarInitialState)

export const Nav: React.FC = () => {
  const [isPanelOpen, {setTrue: openPanel, setFalse: dismissPanel}] = useBoolean(navbarInitialState.isPanelOpen);
  const {activeLink, messages} = useRouteState(navbarInitialState, [dismissPanel])
  const {links, loggedUser, isAdmin} = useSessionState(navbarInitialState)

  return (
    <NavbarContext.Provider value={{
      loggedUser,
      isAdmin,
      links,
      activeLink,
      messages,
      isPanelOpen,
      openPanel,
      dismissPanel
    }}>
      <nav className={styles['nav']}>
        <NavControlBar/>
        <NavMessageBar/>
        <SidePanel/>
      </nav>
    </NavbarContext.Provider>
  );
}


