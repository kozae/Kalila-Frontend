import {
  IRealTimeUpdate,
  ISignalrConnectionData,
  ISignalrMethods,
} from './models';
import React, { createContext, FC, ReactNode } from 'react';
import { useSignalr } from './hooks';

export const SignalrConnectionWrapper = createContext<ISignalrConnectionData>({
  isConnected: false,
  groups: new Set<string>(),
});
export const SignalrMethodWrapper = createContext<ISignalrMethods>({
  async joinGroup() {},
  async leaveGroup() {},
});
export const SignalrUpdateWrapper = createContext<{
  update?: IRealTimeUpdate;
}>({});

export const SignalrProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
