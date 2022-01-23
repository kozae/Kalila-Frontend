import {useRegisteredEditors} from "@frontend/shared-ui";
import {getSessionSWR, IPagination} from "@frontend/util";
import {NextRouter} from "next/router";
import { IAdminPageStore} from "./models";
import {
  createDocumentFactory,
  deleteDocumentFactory,
  processSignalRUpdateFactory,
  updateDocumentFactory
} from "./reducers";
import {getDocuments, getSchema} from "./queries";

// todo refactor to useKalilaDocumentStore in the shared package, move use registered editors out
export function useAdminPageStore(
  activityName: string,
  router: NextRouter
): IAdminPageStore {
  const editors = useRegisteredEditors()
  const session = getSessionSWR();
  const accessToken = session?.accessToken;
  const loggedUser = session?.session?.user?.username;
  const {data: schema, mutate: mutateSchema} = getSchema(accessToken, activityName);
  const {data, isValidating, mutate: mutateDocs} = getDocuments(accessToken, activityName, schema, router);


  if (!isValidating && data) {
    return {
      state: {
        documents: data.content,
        pagination: data.pagination as IPagination,
        schema: schema?.content,
        loggedUser: loggedUser as string,
        editors
      },
      dispatchers: {
        createDocument: createDocumentFactory(accessToken as string, activityName),
        processSignalRUpdate: processSignalRUpdateFactory(mutateDocs, mutateSchema, activityName),
        updateDocument: updateDocumentFactory(accessToken as string, activityName),
        deleteDocument: deleteDocumentFactory(accessToken as string, activityName),
      }
    };
  }

  return {state: undefined, dispatchers: undefined}

}
