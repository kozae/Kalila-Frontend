import { IWrapper } from '@frontend/util';
import { createContext } from 'react';
import { INavbarLink } from '../navbar-links-configuration';

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

export const NavbarStore = createContext(navbarInitialStore);
