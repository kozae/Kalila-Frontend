import {useContext, useEffect} from "react";
import {SignalrStore} from "../stores";

export function subscribeToSignalrUpdates(group: string) {
  const {state: {update, connection, isConnected}, dispatchers: {joinGroup}} = useContext(SignalrStore);
  useEffect(() => {
    if (connection && isConnected) {
      joinGroup(group, connection)
        .then(() => console.log(`${group} group joined`))
    }
  }, [isConnected, connection])

  return update
}
