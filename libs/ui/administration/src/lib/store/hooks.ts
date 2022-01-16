import {IRealTimeUpdate, useKalilaSession, useRegisteredEditors} from "@frontend/shared-ui";
import axios from "axios";
import {useEffect, useReducer, useState} from "react";
import {getPagination, IPagination, IStore, MediaTypes} from "@frontend/util";
import {NextRouter} from "next/router";
import {AdminDocumentsReducer} from "./reducer";
import {AdminDocumentActionType} from "./actions";
import {IAdministrationDispatchers, IAdministrationState} from "./models";

function useSessionState() {
  const {session, accessToken} = useKalilaSession();
  return {loggedUser: session?.user?.name, accessToken}
}

function useAdminDocumentsState() {
  const [documents, documentsDispatcher] = useReducer(AdminDocumentsReducer, [])
  const loadDocuments = (data: any) => documentsDispatcher({
    type: AdminDocumentActionType.Load,
    payload: {documents: data}
  })
  const processSignalRUpdate = (update: IRealTimeUpdate) => {
  }
  const createDocument = (doc: { [key: string]: any }) => {
  }
  const updateDocument = (update: { [key: string]: any }, params: { [key: string]: any }) => {
  }
  const deleteDocument = (id: string) => {
  }

  return {documents, loadDocuments, processSignalRUpdate, createDocument, updateDocument, deleteDocument}
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
  const {pagination, setPagination} = usePaginationState(router);
  const {documents, loadDocuments} = useAdminDocumentsState()
  useEffect(() => {
    if (accessToken !== null) {
      axios.get(`/server/api/v1/${activityName}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': MediaTypes.AdminDocument
        },
        params: router.query
      })
        .then(({data, headers}) => {
          loadDocuments(data);
          setPagination(getPagination(headers))
        })
    }

  }, [activityName, accessToken, router.query])

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
