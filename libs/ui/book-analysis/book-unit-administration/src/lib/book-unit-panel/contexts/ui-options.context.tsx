import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { IBookUnitPanelUIOptions } from '../models';

const UIOptionsConext = createContext<IBookUnitPanelUIOptions>({});

export const useUIOptions = () => useContext(UIOptionsConext);

export const UIOptionsProvider: FC<
  { children: ReactNode } & IBookUnitPanelUIOptions
> = ({ children, accessMode, verticalAnimate }) => {
  const data = useMemo(
    () => ({ accessMode, verticalAnimate }),
    [accessMode, verticalAnimate]
  );
  return (
    <UIOptionsConext.Provider value={data}>{children}</UIOptionsConext.Provider>
  );
};
