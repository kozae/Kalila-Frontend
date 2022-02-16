import { getSessionSWR, IPagination, MediaTypes } from '@frontend/util';
import { NextRouter } from 'next/router';
import {
  getDocuments,
  adminUpdateDocumentFactory,
  createDocumentFactory,
  deleteDocumentFactory,
  processSignalRUpdateFactory,
  updateDocumentsFactory,
  updateOneDocumentFactory,
} from './requests';
import { KalilaDocument } from '@frontend/domain';
import { useEffect } from 'react';
import { IRealTimeUpdate } from '../../wrappers';
import { useAppDispatch } from '../hooks';
import { docsCleared, docsLoaded, docsLoading } from './slice';

export interface IPagedDocumentsRequests<T extends KalilaDocument> {
  createDocument: (doc: T) => Promise<void>;
  processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>;
  updateDocuments: (
    update: { [p: string]: any },
    params: { [p: string]: any }
  ) => Promise<void>;
  updateOneDocument: (
    update: { [p: string]: any },
    params: { [p: string]: any }
  ) => Promise<void>;
  adminUpdateDocument: (
    update: { [p: string]: any },
    params: { [p: string]: any }
  ) => Promise<void>;
  deleteDocument: (id: string, additionalParams: any) => Promise<void>;
}

function dispatchDataChangesToStore(
  isValidating: boolean,
  data: { content: any; pagination: IPagination | undefined } | undefined
) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isValidating) {
      dispatch(docsLoading());
    } else if (data) {
      dispatch(
        docsLoaded({
          docs: data.content,
          pagination: data.pagination as IPagination,
        })
      );
    }
  }, [data, isValidating]);
}

function clearDocOnUnmount() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(docsCleared());
    };
  }, []);
}

export function usePagedDocuments<T extends KalilaDocument>(
  activityName: string,
  router: NextRouter,
  mediaType: MediaTypes,
  additionalParams = {}
): IPagedDocumentsRequests<T> {
  const session = getSessionSWR();
  const accessToken = session?.accessToken;
  const {
    data,
    isValidating,
    mutate: mutateDocs,
  } = getDocuments(
    accessToken,
    activityName,
    router,
    mediaType,
    additionalParams
  );

  dispatchDataChangesToStore(isValidating, data);
  clearDocOnUnmount();

  return {
    createDocument: createDocumentFactory<T>(
      accessToken as string,
      activityName
    ),
    processSignalRUpdate: processSignalRUpdateFactory(mutateDocs, activityName),
    updateDocuments: updateDocumentsFactory(
      accessToken as string,
      activityName
    ),
    updateOneDocument: updateOneDocumentFactory(
      accessToken as string,
      activityName
    ),
    adminUpdateDocument: adminUpdateDocumentFactory(
      accessToken as string,
      activityName
    ),
    deleteDocument: deleteDocumentFactory(accessToken as string, activityName),
  };
}
