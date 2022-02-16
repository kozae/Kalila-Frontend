import { useContext, useEffect } from 'react';
import { IRealTimeUpdate, SignalrStore } from '../store';

export function transformGroupName(name: string) {
  switch (name) {
    case 'PageDescription':
    case 'PageTranscription':
      return 'Page';
    default:
      return name;
  }
}

export function useSignalrUpdates<
  TDispatchers extends {
    processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>;
  }
>(group: string, dispatchers?: TDispatchers) {
  const {
    state: { update, connection, isConnected },
    dispatchers: { joinGroup },
  } = useContext(SignalrStore);

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup(transformGroupName(group), connection).then(() =>
        console.log(`${group} group joined`)
      );
    }
  }, [isConnected, connection]);

  useEffect(() => {
    if (update && dispatchers && dispatchers.processSignalRUpdate) {
      dispatchers.processSignalRUpdate(update).catch();
    }
  }, [update]);
}
