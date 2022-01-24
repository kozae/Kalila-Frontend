import {getSessionSWR, IPagination} from "@frontend/util";
import {NextRouter} from "next/router";
import { IPaginatedDocuments} from "./models";
import {
  createDocumentFactory,
  deleteDocumentFactory,
  processSignalRUpdateFactory,
  updateDocumentFactory
} from "./reducers";
import {getDocuments, getSchema} from "./queries";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {plainToInstance} from "class-transformer";

export function usePaginatedDocuments<T extends  object>(
  activityName: string,
  router: NextRouter,
  cls: ClassConstructor<T>
): IPaginatedDocuments<T> {
  const session = getSessionSWR();
  const accessToken = session?.accessToken;
  const loggedUser = session?.session?.user?.username;
  const {data: schema, mutate: mutateSchema} = getSchema(accessToken, activityName);
  const {data, isValidating, mutate: mutateDocs} = getDocuments(accessToken, activityName, schema, router);


  if (!isValidating && data) {
    return {
      state: {
        documents: plainToInstance(cls, data.content as any[]),
        pagination: data.pagination as IPagination,
        schema: schema?.content,
        loggedUser: loggedUser as string,
      },
      dispatchers: {
        createDocument: createDocumentFactory(accessToken as string, activityName),
        processSignalRUpdate: processSignalRUpdateFactory(mutateDocs, mutateSchema, activityName),
        updateDocument: updateDocumentFactory(accessToken as string, activityName),
        deleteDocument: deleteDocumentFactory(accessToken as string, activityName),
      }
    };
  }

  return {state: undefined, dispatchers: undefined, loading: true}

}
