import React from "react";
import {ISignalrDispatchers, ISignalrState} from "./models";
import {IStore} from "@frontend/util";


const signalrInitialStore: IStore<ISignalrState, ISignalrDispatchers> = {
  state: {
    isConnected: false,
    groups: new Set<string>(),
  },
  dispatchers: {
    async joinGroup() {
    },
    async leaveGroup() {
    }
  },
}


export const SignalrStore = React.createContext(signalrInitialStore);
export * from './hooks';
export * from './models';
