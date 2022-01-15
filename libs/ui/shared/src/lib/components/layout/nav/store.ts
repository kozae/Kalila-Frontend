import {INavbarLink} from "@frontend/shared-ui";
import React from "react";
import {IStore} from "@frontend/util";

export interface INavbarState {
  loggedUser?: string | null,
  isAdmin: boolean,
  activeLink: string,
  links: INavbarLink[],
  messages: [string | undefined, string | undefined],
  isPanelOpen: boolean,
}

export interface INavbarDispatchers {
  openPanel: () => void,
  dismissPanel: () => void,
}

export const navbarInitialStore: IStore<INavbarState, INavbarDispatchers> = {
  state: {
    isAdmin: false,
    activeLink: '/',
    links: [],
    messages: ['Home', undefined],
    isPanelOpen: false,
  },
  dispatchers: {
    openPanel: () => {
    },
    dismissPanel: () => {
    },
  }
}

export const NavbarStore = React.createContext(navbarInitialStore)
