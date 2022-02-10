import { getSessionSWR, IPagination, MediaTypes } from '@frontend/util';
import { NextRouter } from 'next/router';
import { IPaginatedDocuments } from './models';
import {
  adminUpdateDocumentFactory,
  createDocumentFactory,
  deleteDocumentFactory,
  processSignalRUpdateFactory,
  updateDocumentsFactory,
  updateOneDocumentFactory,
} from './reducers';
import { getDocuments } from './queries';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';
import { KalilaDocument } from '@frontend/domain';

export function usePaginatedDocuments<T extends KalilaDocument>(
  activityName: string,
  router: NextRouter,
  cls: ClassConstructor<T>,
  mediaType: MediaTypes,
  additionalParams = {}
): IPaginatedDocuments<T> {
  const session = getSessionSWR();
  const accessToken = session?.accessToken;
  const loggedUser = session?.session?.user?.username;
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

  if (!isValidating && data) {
    return {
      state: {
        documents: plainToInstance(cls, data.content as any[]),
        pagination: data.pagination as IPagination,
        loggedUser: loggedUser as string,
      },
      dispatchers: {
        createDocument: createDocumentFactory<T>(
          accessToken as string,
          activityName
        ),
        processSignalRUpdate: processSignalRUpdateFactory(
          mutateDocs,
          activityName
        ),
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
        deleteDocument: deleteDocumentFactory(
          accessToken as string,
          activityName
        ),
      },
      loading: false,
    };
  }

  return { state: undefined, dispatchers: undefined, loading: true };
}
