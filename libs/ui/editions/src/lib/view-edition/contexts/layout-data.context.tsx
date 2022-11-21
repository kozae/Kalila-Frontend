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
  ILayoutData,
  ILayoutOptionsMethods,
} from '../models';
import { fabric } from 'fabric';
import { useDisableUpdateForGuest, useFullWidth } from '../hooks';

export const LayoutDataContext = createContext<
  ILayoutData & IEditionPageAppOptions
>({
  size: 'xs',
  font: 'a',
  username: undefined,
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
  disableMaxWidth: () => {},
  enableMaxWidth: () => {},
});

export const useLayoutData = () => useContext(LayoutDataContext);
export const useLayoutDataMethods = () => useContext(LayoutDataMethodsContext);

export const LayoutDataProvider: FC<
  { children: ReactNode } & IEditionPageAppOptions &
    IEditionPageAppOptionMutators
> = ({ children, username, disableMaxWidth, enableMaxWidth }) => {
  const [size, setSize] = useState<EditionFontSize>('xs');
  const [font, setFont] = useState<EditionFontFamily>('a');
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useDisableUpdateForGuest(username);
  useFullWidth(enableMaxWidth, disableMaxWidth);

  const options = useMemo(
    () => ({
      font,
      size,
      username,
      canvas,
    }),
    [font, size, username, canvas]
  );
  return (
    <LayoutDataMethodsContext.Provider
      value={{
        setSize,
        setFont,
        setCanvas,
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
