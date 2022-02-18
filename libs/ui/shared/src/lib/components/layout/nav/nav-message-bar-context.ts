import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { kalilaTheme } from '../../../constants';

export interface INavMessageBarControl {
  messages: [string | undefined, string | undefined];
  color: string;
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string
  ) => void;
}

const defaultValue: INavMessageBarControl = {
  messages: [undefined, undefined],
  color: '',
  changeMessage: (
    newMessages: [string | undefined, string | undefined],
    color?: string
  ) => {},
};

export const NavMessageBarContext =
  React.createContext<INavMessageBarControl>(defaultValue);

export function useNavMessageBarControls(): INavMessageBarControl {
  const [{ messages, color }, setMessages] = React.useState<{
    messages: [string | undefined, string | undefined];
    color: string;
  }>({
    messages: [undefined, undefined],
    color: kalilaTheme.palette.primary.main,
  });
  const changeMessage = useCallback(
    (
      newMessages: [string | undefined, string | undefined],
      newColor?: string
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
      setTimeout(() => setMessages({ messages: newMessages, color }), 1000);
    },
    [messages]
  );

  return { messages, color, changeMessage };
}

export function useNavbarMessage(
  newMessages: [string | undefined, string | undefined],
  newColor?: string
) {
  const { changeMessage } = React.useContext(NavMessageBarContext);
  useEffect(() => changeMessage(newMessages, newColor), []);
}
