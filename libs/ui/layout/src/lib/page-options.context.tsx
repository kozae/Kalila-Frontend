import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  FC,
} from 'react';
export interface IPageOptions {
  maxWidthEnabled: boolean;
}
export interface IPageOptionsMethods {
  enableMaxWidth: () => void;
  disableMaxWidth: () => void;
}

const PageOptionsContext = createContext<IPageOptions>({
  maxWidthEnabled: false,
});

export const usePageOptions = () => useContext(PageOptionsContext);

const PageOptionsMethodsContext = createContext<IPageOptionsMethods>({
  enableMaxWidth: () => {},
  disableMaxWidth: () => {},
});

export const usePageOptionsMethods = () =>
  useContext(PageOptionsMethodsContext);

export const PageOptionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMaxWidthEnabled, setIsMaxWidthEnabled] = useState<boolean>(false);

  const data = useMemo(
    () => ({ maxWidthEnabled: isMaxWidthEnabled }),
    [isMaxWidthEnabled]
  );

  const methods = useMemo(
    () => ({
      enableMaxWidth: () => setIsMaxWidthEnabled(true),
      disableMaxWidth: () => setIsMaxWidthEnabled(false),
    }),
    [setIsMaxWidthEnabled]
  );

  return (
    <PageOptionsMethodsContext.Provider value={methods}>
      <PageOptionsContext.Provider value={data}>
        {children}
      </PageOptionsContext.Provider>
    </PageOptionsMethodsContext.Provider>
  );
};
