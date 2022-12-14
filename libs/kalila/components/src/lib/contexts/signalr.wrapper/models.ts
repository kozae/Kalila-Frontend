import { HubConnection } from '@microsoft/signalr';

export interface IRealTimeUpdate {
  Topic: string;
  Data: any;
}

export interface ISignalrConnectionData {
  groups: Set<string>;
  isConnected: boolean;
  connection?: HubConnection | null;
}

export interface ISignalrMethods {
  joinGroup: (group: string, connection: HubConnection) => Promise<void>;
  leaveGroup: (group: string, connection: HubConnection) => Promise<void>;
}
