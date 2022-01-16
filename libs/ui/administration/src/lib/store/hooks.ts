import {IRealTimeUpdate, useKalilaSession} from "@frontend/shared-ui";
import {useState} from "react";
import {createFetcher, IPagination, IStore} from "@frontend/util";
import {NextRouter} from "next/router";

import {IAdministrationDispatchers, IAdministrationState} from "./models";
import useSWR from "swr";

function useSessionState() {
  const {session, accessToken} = useKalilaSession();
  return {loggedUser: session?.user?.name, accessToken}
}

function useAdminDocumentsState(
  activityName: string,
  fetcher: (url: string, query?: Record<string, any>, accept?: string) => Promise<{ content: any, pagination: {} }>) {
  const {data, error} = useSWR(`/server/api/v1/${activityName}`, fetcher)
  const documents = data?.content ?? {};
  const processSignalRUpdate = (update: IRealTimeUpdate) => {
  }
  const createDocument = (doc: { [key: string]: any }) => {
  }
  const updateDocument = (update: { [key: string]: any }, params: { [key: string]: any }) => {
  }
  const deleteDocument = (id: string) => {
  }

  return {documents, processSignalRUpdate, createDocument, updateDocument, deleteDocument}
}


function usePaginationState({query}: NextRouter) {
  const pageSize = query["PageSize"] ?? 10;
  const pageNumber = query["PageNumber"] ?? 1;
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: pageNumber as number,
    itemsPerPage: pageSize as number,
    totalItems: 0,
    totalPages: 0,
  })
  return {pagination, setPagination}
}

export function useAdminPageStore(
  activityName: string,
  router: NextRouter,
  update: IRealTimeUpdate
): IStore<IAdministrationState, IAdministrationDispatchers> {
  const {loggedUser, accessToken} = useSessionState();
  const fetcher = createFetcher(accessToken as string)
  const {pagination, setPagination} = usePaginationState(router);
  const {documents} = useAdminDocumentsState(activityName, fetcher)


  return {
    state: {
      documents,
      pagination,
      loggedUser,
      editors: [
        {
          username: 'mk',
          name: 'Mahmoud Kozae'
        },
        {
          username: 'ds',
          name: 'Dima Sakran'
        }
      ]
    },
    dispatchers: {}
  };
}
