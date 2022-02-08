import { KeyedMutator } from 'swr';
import { IPagination } from '@frontend/util';
import axios from 'axios';
import { IRealTimeUpdate, transformGroupName } from '@frontend/shared-ui';
import { KalilaDocument } from '@frontend/domain';
import { paramsSerializer } from '@frontend/util';

type Mutator = KeyedMutator<{
  content: any[];
  pagination: IPagination | undefined;
}>;

export function createDocumentFactory<T extends KalilaDocument>(
  accessToken: string,
  activityName: string
) {
  return async (doc: T) => {
    await axios.post(`/server/api/v1/${activityName}`, doc, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

export function processSignalRUpdateFactory(
  mutateDocs: Mutator,
  mutateSchema: Mutator,
  activityName: string
) {
  return async (update: IRealTimeUpdate) => {
    if (update) {
      if (update.Topic.endsWith(transformGroupName(activityName))) {
        await mutateDocs(); // triggers another request to the backend
        return;
      }
      if (
        activityName === 'CategoricalAttribute' &&
        update.Topic.endsWith(transformGroupName(activityName))
      ) {
        await mutateDocs();
        return;
      }
      if (
        activityName !== 'CategoricalAttribute' &&
        update.Topic.endsWith('CategoricalAttribute')
      ) {
        await mutateSchema();
      }
    }
  };
}

export function updateDocumentsFactory(
  accessToken: string,
  activityName: string
) {
  return async (
    update: { [key: string]: any },
    params: { [key: string]: any }
  ) => {
    await axios.patch(`/server/api/v1/${activityName}`, update, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

export function updateOneDocumentFactory(
  accessToken: string,
  activityName: string
) {
  return async (
    update: { [key: string]: any },
    params: { [key: string]: any }
  ) => {
    await axios.patch(`/server/api/v1/${activityName}/One`, update, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

export function adminUpdateDocumentFactory(
  accessToken: string,
  activityName: string
) {
  return async (
    update: { [key: string]: any },
    params: { [key: string]: any }
  ) => {
    await axios.patch(`/server/api/v1/${activityName}/Admin`, update, {
      params,
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

export function deleteDocumentFactory(
  accessToken: string,
  activityName: string
) {
  return async (id: string, additionalParams: any = {}) => {
    await axios.delete(`/server/api/v1/${activityName}`, {
      params: { Id: id, ...additionalParams },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}
