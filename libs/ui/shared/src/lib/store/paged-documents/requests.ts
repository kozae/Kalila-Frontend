import useSWR, { KeyedMutator } from 'swr';
import { fetcher, IPagination, MediaTypes } from '@frontend/util';
import axios from 'axios';
import { IRealTimeUpdate, transformGroupName } from '@frontend/shared-ui';
import { KalilaDocument } from '@frontend/domain';
import { paramsSerializer } from '@frontend/util';
import { NextRouter } from 'next/router';

type Mutator = KeyedMutator<{
  content: any[];
  pagination: IPagination | undefined;
}>;

export function getDocuments<T extends KalilaDocument>(
  accessToken: string | undefined | null,
  activityName: string,
  { query }: NextRouter,
  mediaType: MediaTypes,
  additionalParams = {}
) {
  return useSWR(
    accessToken
      ? [
          // only fetch if access token is present
          activityName,
          accessToken,
          query,
          mediaType,
          additionalParams,
        ]
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}

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
  activityName: string
) {
  return async (update: IRealTimeUpdate) => {
    if (update && update.Topic.endsWith(transformGroupName(activityName))) {
      await mutateDocs(); // triggers another request to the backend
      return;
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
