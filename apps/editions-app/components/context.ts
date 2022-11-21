import { createContext } from 'react';

export const EditionsAppContext = createContext({
  showNavbar: true,
  editionName: undefined,
  setShowNavbar: (c: boolean) => {},
  setEditionName: (c: string | undefined) => {},
});
