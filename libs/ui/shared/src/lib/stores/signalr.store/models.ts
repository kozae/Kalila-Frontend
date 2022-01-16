import {HubConnection} from "@microsoft/signalr";

export interface IRealTimeUpdate {
  Topic: string;
  Data: any;
}

export interface ISignalrState {
  groups: Set<string>,
  update?: IRealTimeUpdate,
  isConnected: boolean,
  connection?: HubConnection | null
}

export interface ISignalrDispatchers {
  joinGroup: (group: string, connection: HubConnection) => Promise<void>,
  leaveGroup: (group: string, connection: HubConnection) => Promise<void>,
}

