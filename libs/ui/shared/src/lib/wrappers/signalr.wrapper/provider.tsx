import {
  IRealTimeUpdate,
  ISignalrConnectionData,
  ISignalrMethods,
} from './models';
import React, { FC } from 'react';
import { useSignalr } from './hooks';

export const SignalrConnectionWrapper =
  React.createContext<ISignalrConnectionData>({
    isConnected: false,
    groups: new Set<string>(),
  });
export const SignalrMethodWrapper = React.createContext<ISignalrMethods>({
  async joinGroup() {},
  async leaveGroup() {},
});
export const SignalrUpdateWrapper = React.createContext<{
  update?: IRealTimeUpdate;
}>({});

export const SignalrProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connectionData, methods, update } = useSignalr();
  return (
    <SignalrMethodWrapper.Provider value={methods}>
      <SignalrConnectionWrapper.Provider value={connectionData}>
        <SignalrUpdateWrapper.Provider value={update}>
          {children}
        </SignalrUpdateWrapper.Provider>
      </SignalrConnectionWrapper.Provider>
    </SignalrMethodWrapper.Provider>
  );
};
