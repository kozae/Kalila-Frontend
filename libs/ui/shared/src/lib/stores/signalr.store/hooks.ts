import {useEffect, useReducer, useState} from "react";
import {GroupsActionType, groupsReducer} from "./reducer";
import {HubConnectionBuilder, HubConnection, LogLevel} from "@microsoft/signalr";
import {IRealTimeUpdate, ISignalrDispatchers, ISignalrState} from "./models";
import {useBoolean} from "@fluentui/react-hooks";
import {IStore} from "@frontend/util";

function useGroupsState() {
  const [{groups}, dispatchGroupAction] = useReducer(groupsReducer, {groups: new Set<string>()})
  const joinGroup = async (group: string, connection: HubConnection) => {
    dispatchGroupAction({type: GroupsActionType.Add, payload: group});
    if (connection && connection.connectionId) {
      await connection.invoke('JoinGroup', group)
    }
  }


  const leaveGroup = async (group: string, connection: HubConnection) => {
    dispatchGroupAction({type: GroupsActionType.Remove, payload: group})
    if (connection && connection.connectionId) {
      await connection.invoke('LeaveGroup', group);
    }
  }
  return {groups, joinGroup, leaveGroup};
}

export function useSignalr(): IStore<ISignalrState, ISignalrDispatchers> {
  const [connection, setConnection] = useState<HubConnection | undefined | null>();
  const [isConnected, {setTrue: setIsConnected, setFalse: setIsDisconnected}] = useBoolean(false);
  const {groups, joinGroup, leaveGroup} = useGroupsState();
  const [update, setUpdate] = useState<IRealTimeUpdate | undefined>(undefined);


  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('/server/realtime/hub') // todo add in .env
      .withAutomaticReconnect()
      .build();
    connect.start()
      .then(() => setIsConnected())
      .catch((e) => {
        console.log('connecting to signalr failed')
        console.log(e)
      });
    setConnection(connect);
  }, []);


  useEffect(() => {
    if (connection) {
      connection.onclose(() => {
        setIsDisconnected()
      })
      connection.onreconnected(() => {
        setIsConnected()
      })
    }

  }, [connection])


  useEffect(() => {
    if (connection) {
      connection.on('DocumentUpdate', (serverUpdate: IRealTimeUpdate) => {
        setUpdate(serverUpdate)
      })
    }
  }, [connection])

  return {
    state: {
      connection, groups, update, isConnected
    },
    dispatchers: {
      joinGroup,
      leaveGroup
    }
  }
}


