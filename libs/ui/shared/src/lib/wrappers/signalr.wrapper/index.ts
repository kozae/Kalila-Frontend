import React from 'react';
import { ISignalrMethods, ISignalrWrapper } from './models';
import { IStore } from '@frontend/util';

const signalrInitialStore: IStore<ISignalrWrapper, ISignalrMethods> = {
  state: {
    isConnected: false,
    groups: new Set<string>(),
  },
  dispatchers: {
    async joinGroup() {},
    async leaveGroup() {},
  },
};

export const SignalrStore = React.createContext(signalrInitialStore);
export * from './hooks';
export * from './models';
