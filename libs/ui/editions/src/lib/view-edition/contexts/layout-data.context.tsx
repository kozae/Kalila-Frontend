import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  EditionFontFamily,
  EditionFontSize,
  IEditionPageAppOptionMutators,
  IEditionPageAppOptions,
  ILayoutData,
  ILayoutOptionsMethods,
} from '../models';
import { fabric } from 'fabric';
import { useVirtual } from 'react-virtual';
import { useData } from './data.context';
import { useDisableUpdateForGuest, useFullWidth } from '../hooks';

export const LayoutDataContext = createContext<
  ILayoutData & IEditionPageAppOptions
>({
  size: 'xs',
  font: 'a',
  username: undefined,
  showNavbar: true,
  canvas: null,
});
export const LayoutDataMethodsContext = createContext<
  ILayoutOptionsMethods & IEditionPageAppOptionMutators
>({
  setSize: (
    v: EditionFontSize | ((v: EditionFontSize) => EditionFontSize)
  ) => {},
  setFont: (
    v: EditionFontFamily | ((v: EditionFontFamily) => EditionFontFamily)
  ) => {},
  setCanvas: (
    v:
      | fabric.Canvas
      | null
      | ((v: fabric.Canvas | null) => fabric.Canvas | null)
  ) => {},
  setShowNavbar: (v: boolean) => {},
  disableMaxWidth: () => {},
  enableMaxWidth: () => {},
});

export const useLayoutData = () => useContext(LayoutDataContext);
export const useLayoutDataMethods = () => useContext(LayoutDataMethodsContext);

export const LayoutDataProvider: FC<
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
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useDisableUpdateForGuest(username);
  useFullWidth(enableMaxWidth, disableMaxWidth);

  const options = useMemo(
    () => ({
      font,
      size,
      username,
      showNavbar,
      canvas,
    }),
    [font, size, username, showNavbar, canvas]
  );
  return (
    <LayoutDataMethodsContext.Provider
      value={{
        setSize,
        setFont,
        setCanvas,
        setShowNavbar,
        disableMaxWidth,
        enableMaxWidth,
      }}
    >
      <LayoutDataContext.Provider value={options}>
        {children}
      </LayoutDataContext.Provider>
    </LayoutDataMethodsContext.Provider>
  );
};
