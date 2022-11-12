import * as React from 'react';
import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { kalilaTheme } from '../../../constants';

export interface INavMessageBarControl {
  messages: [string | undefined, string | undefined];
  color: string;
  pageControls: ReactNode | null;
  setPageControls: (n: ReactNode | null) => void;
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string
  ) => void;
}

const defaultValue: INavMessageBarControl = {
  messages: [undefined, undefined],
  color: '',
  pageControls: null,
  setPageControls: (n: ReactNode | null) => null,
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string
  ) => {},
};

export const NavMessageBarContext =
  React.createContext<INavMessageBarControl>(defaultValue);

export const NavMessageBarContextProvider: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <NavMessageBarContext.Provider value={useNavMessageBarControls()}>
      {children}
    </NavMessageBarContext.Provider>
  );
};

export function useNavMessageBarControls(): INavMessageBarControl {
  const [context, setContext] = React.useState<{
    messages: [string | undefined, string | undefined];
    color: string;
  }>({
    messages: [undefined, undefined],
    color: kalilaTheme.palette.secondary.main,
  });

  const [pageControls, setPageControls] = React.useState<ReactNode | null>(
    null
  );

  const changeMessage = useCallback(
    (
      newMessages: [string | undefined, string | undefined],
      newColor?: string
    ) => {
      const color = newColor ?? kalilaTheme.palette.secondary.main;
      if (newMessages[0] === context.messages[0]) {
        setContext({
          messages: [context.messages[0], undefined],
          color,
        });
      } else {
        setContext({
          messages: [undefined, undefined],
          color,
        });
      }

      setTimeout(
        () =>
          setContext({
            messages: newMessages,
            color,
          }),
        1000
      );
    },
    [context]
  );

  return useMemo(
    () => ({ ...context, changeMessage, pageControls, setPageControls }),
    [context, pageControls]
  );
}

export function useNavbarMessage(
  newMessages: [string | undefined, string | undefined],
  newColor?: string
) {
  const { changeMessage } = React.useContext(NavMessageBarContext);
  useEffect(() => changeMessage(newMessages, newColor), [newMessages[0]]);
}

export function usePageControls(
  component: ReactNode | null,
  hideWhen: boolean = false,
  deps: any[] = []
) {
  const { setPageControls } = React.useContext(NavMessageBarContext);

  useEffect(() => {
    if (hideWhen) {
      setPageControls(null);
    } else {
      setPageControls(component);
    }
  }, [hideWhen]);

  useEffect(() => {
    setPageControls(component);
    return () => {
      setPageControls(null);
    };
  }, deps);
}
