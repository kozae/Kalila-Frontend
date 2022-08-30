import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  EditionFontFamily,
  EditionFontSize,
  IEditionPageAppOptionMutators,
  IEditionPageAppOptions,
  ILayoutOptions,
  ILayoutOptionsMethods,
} from '../models';

export const LayoutOptionsContext = createContext<
  ILayoutOptions & IEditionPageAppOptions
>({
  size: 'xs',
  font: 'a',
  username: undefined,
  showNavbar: true,
});
export const LayoutOptionsMethodsContext = createContext<
  ILayoutOptionsMethods & IEditionPageAppOptionMutators
>({
  setSize: (
    v: EditionFontSize | ((v: EditionFontSize) => EditionFontSize)
  ) => {},
  setFont: (
    v: EditionFontFamily | ((v: EditionFontFamily) => EditionFontFamily)
  ) => {},
  setShowNavbar: (v: boolean) => {},
  disableMaxWidth: () => {},
  enableMaxWidth: () => {},
});

export const useLayoutOptions = () => useContext(LayoutOptionsContext);
export const useLayoutOptionsMethods = () =>
  useContext(LayoutOptionsMethodsContext);

export const LayoutOptionsProvider: FC<
  { children: ReactNode } & IEditionPageAppOptions &
    IEditionPageAppOptionMutators
> = ({
  children,
  username,
  showNavbar,
  setShowNavbar,
  disableMaxWidth,
  enableMaxWidth,
}) => {
  const [size, setSize] = useState<EditionFontSize>('s');
  const [font, setFont] = useState<EditionFontFamily>('a');
  const options = useMemo(
    () => ({ font, size, username, showNavbar }),
    [font, size, username, showNavbar]
  );
  return (
    <LayoutOptionsMethodsContext.Provider
      value={{
        setSize,
        setFont,
        setShowNavbar,
        disableMaxWidth,
        enableMaxWidth,
      }}
    >
      <LayoutOptionsContext.Provider value={options}>
        {children}
      </LayoutOptionsContext.Provider>
    </LayoutOptionsMethodsContext.Provider>
  );
};
