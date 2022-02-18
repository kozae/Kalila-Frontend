import { HubConnection } from '@microsoft/signalr';

export interface IRealTimeUpdate {
  Topic: string;
  Data: any;
}

export interface ISignalrData {
  groups: Set<string>;
  update?: IRealTimeUpdate;
  isConnected: boolean;
  connection?: HubConnection | null;
}

export interface ISignalrMethods {
  joinGroup: (group: string, connection: HubConnection) => Promise<void>;
  leaveGroup: (group: string, connection: HubConnection) => Promise<void>;
}
