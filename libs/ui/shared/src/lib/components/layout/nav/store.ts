import { INavbarLink } from '@frontend/shared-ui';
import React from 'react';
import { IWrapper } from '@frontend/util';

export interface INavbarState {
  loggedUser?: string | null;
  isAdmin: boolean;
  activeLink: string;
  links: INavbarLink[];
  isPanelOpen: boolean;
}

export interface INavbarDispatchers {
  openPanel: () => void;
  dismissPanel: () => void;
  togglePanel: () => void;
}

export const navbarInitialStore: IWrapper<INavbarState, INavbarDispatchers> = {
  data: {
    isAdmin: false,
    activeLink: '/',
    links: [],
    isPanelOpen: false,
  },
  methods: {
    openPanel: () => {},
    dismissPanel: () => {},
    togglePanel: () => {},
  },
};

export const NavbarStore = React.createContext(navbarInitialStore);
