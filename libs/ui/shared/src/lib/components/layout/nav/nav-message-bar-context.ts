import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { kalilaTheme } from '../../../constants';
import { IManuscriptPagesPaginatorProps } from './command-bars';

export type CommandBars = {
  name: 'manuscript-pages-paginator';
  data: IManuscriptPagesPaginatorProps;
};

export interface INavMessageBarControl {
  messages: [string | undefined, string | undefined];
  color: string;
  commandBar?: CommandBars;
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string,
    newCommandBar?: CommandBars
  ) => void;
}

const defaultValue: INavMessageBarControl = {
  messages: [undefined, undefined],
  color: '',
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string,
    newCommandBar?: CommandBars
  ) => {},
};

export const NavMessageBarContext =
  React.createContext<INavMessageBarControl>(defaultValue);

export function useNavMessageBarControls(): INavMessageBarControl {
  const [{ messages, color, commandBar }, setMessages] = React.useState<{
    messages: [string | undefined, string | undefined];
    color: string;
    commandBar?: CommandBars;
  }>({
    messages: [undefined, undefined],
    color: kalilaTheme.palette.primary.main,
  });

  const changeMessage = useCallback(
    (
      newMessages: [string | undefined, string | undefined],
      newColor?: string,
      newCommandBar?: CommandBars
    ) => {
      const color = newColor ?? kalilaTheme.palette.primary.main;
      if (newMessages[0] === messages[0]) {
        setMessages({
          messages: [messages[0], undefined],
          color,
        });
      } else {
        setMessages({
          messages: [undefined, undefined],
          color,
        });
      }

      setTimeout(
        () =>
          setMessages({
            messages: newMessages,
            color,
            commandBar: newCommandBar,
          }),
        1000
      );
    },
    [messages]
  );

  return { messages, color, commandBar, changeMessage };
}

export function useNavbarMessage(
  newMessages: [string | undefined, string | undefined],
  newColor?: string,
  newCommandBar?: CommandBars
) {
  const { changeMessage } = React.useContext(NavMessageBarContext);
  useEffect(() => changeMessage(newMessages, newColor, newCommandBar), []);
}
