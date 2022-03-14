import React from 'react';
import { ISignalrMethods, ISignalrData } from './models';
import { IWrapper } from '@frontend/util';

const signalrInitialStore: IWrapper<ISignalrData, ISignalrMethods> = {
  data: {
    isConnected: false,
    groups: new Set<string>(),
  },
  methods: {
    async joinGroup() {},
    async leaveGroup() {},
  },
};

export const SignalrWrapper = React.createContext(signalrInitialStore);
export * from './hooks';
export * from './models';
