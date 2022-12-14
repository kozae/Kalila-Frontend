import { useEffect, useMemo } from 'react';

import { HubConnection } from '@microsoft/signalr';
import { KeyedMutator } from 'swr';
import { IPagination } from '@frontend/util';
import {
  IRealTimeUpdate,
  useSignalrConnection,
  useSignalrMethods,
  useSignalrUpdate,
} from '../contexts/signalr.wrapper';

type Mutator = KeyedMutator<{
  content: any[];
  pagination: IPagination | undefined;
}>;

export function transformGroupName(name: string) {
  switch (name) {
    case 'PageDescription':
    case 'PageTranscription':
      return 'Page';
    default:
      return name;
  }
}

export function processSignalRUpdateFactory(
  mutateDocs: Mutator,
  activityName: string
) {
  return async (update: IRealTimeUpdate) => {
    if (update && update.Topic.endsWith(transformGroupName(activityName))) {
      await mutateDocs(); // triggers another request to the backend
      return;
    }
  };
}

export function useSignalrUpdates(mutateDocs: Mutator, activityName: string) {
  const { update } = useSignalrUpdate();
  const { connection, isConnected } = useSignalrConnection();
  const { joinGroup, leaveGroup } = useSignalrMethods();

  const processSignalRUpdate = useMemo(
    () => processSignalRUpdateFactory(mutateDocs, activityName),
    [mutateDocs, activityName]
  );

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup(transformGroupName(activityName), connection).then(() =>
        console.log(`${activityName} group joined`)
      );
    }
  }, [isConnected, connection]);

  useEffect(() => {
    return () => {
      leaveGroup(
        transformGroupName(activityName),
        connection as HubConnection
      ).then(() => console.log(`${activityName} group left`));
    };
  }, []);

  useEffect(() => {
    if (update) {
      processSignalRUpdate(update).catch();
    }
  }, [update]);
}
