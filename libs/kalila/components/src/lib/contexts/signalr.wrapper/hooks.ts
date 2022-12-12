import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { GroupsActionType, groupsReducer } from './reducer';
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from '@microsoft/signalr';
import { IRealTimeUpdate } from './models';
import {
  SignalrConnectionWrapper,
  SignalrMethodWrapper,
  SignalrUpdateWrapper,
} from './provider';
import { useBoolean } from '@frontend/util';

function useGroupsState() {
  const [{ groups }, dispatchGroupAction] = useReducer(groupsReducer, {
    groups: new Set<string>(),
  });
  const joinGroup = useCallback(
    async (group: string, connection: HubConnection) => {
      dispatchGroupAction({ type: GroupsActionType.Add, payload: group });
      if (connection && connection.connectionId) {
        await connection.invoke('JoinGroup', group);
      }
    },
    []
  );

  const leaveGroup = useCallback(
    async (group: string, connection: HubConnection) => {
      dispatchGroupAction({ type: GroupsActionType.Remove, payload: group });
      if (connection && connection.connectionId) {
        await connection.invoke('LeaveGroup', group);
      }
    },
    []
  );
  return { groups, joinGroup, leaveGroup };
}

export function useSignalr() {
  const [connection, setConnection] = useState<
    HubConnection | undefined | null
  >();
  const [
    isConnected,
    { setTrue: setIsConnected, setFalse: setIsDisconnected },
  ] = useBoolean(false);
  const { groups, joinGroup, leaveGroup } = useGroupsState();
  const [update, setUpdate] = useState<IRealTimeUpdate | undefined>(undefined);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(process.env['NEXT_PUBLIC_SIGNALR_URL'] as string)
      .withAutomaticReconnect()
      .build();
    connect
      .start()
      .then(() => setIsConnected())
      .catch((e) => {
        console.log('connecting to signalr failed');
        console.log(e);
      });
    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.onclose(() => {
        setIsDisconnected();
      });
      connection.onreconnected(() => {
        setIsConnected();
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) {
      connection.on('DocumentUpdate', (serverUpdate: IRealTimeUpdate) => {
        setUpdate(serverUpdate);
      });
    }
  }, [connection]);

  return {
    connectionData: useMemo(
      () => ({
        connection,
        groups,
        isConnected,
      }),
      [connection, groups, isConnected]
    ),
    update: { update },
    methods: {
      joinGroup,
      leaveGroup,
    },
  };
}

export const useSignalrUpdate = () => useContext(SignalrUpdateWrapper);
export const useSignalrConnection = () => useContext(SignalrConnectionWrapper);
export const useSignalrMethods = () => useContext(SignalrMethodWrapper);
