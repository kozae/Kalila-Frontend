import {useContext, useEffect} from "react";
import {IRealTimeUpdate, SignalrStore} from "../stores";

export function useSignalrUpdates<TDispatchers extends { processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void> }>(group: string, dispatchers?: TDispatchers) {
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup(group, connection)
        .then(() => console.log(`${group} group joined`))
    }
  }, [isConnected, connection])

  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch()
    }
  }, [update])
}
