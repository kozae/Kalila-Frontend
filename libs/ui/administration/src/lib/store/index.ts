import React from "react";
import {IAdministrationDispatchers, IAdministrationState} from "./models";
import {IStore} from "@frontend/util";


const initialAdminContextValues: IStore<IAdministrationState, IAdministrationDispatchers> = {
  state: {
    loggedUser: '',
    editors: [],
    documents: [],
    pagination: {
      currentPage: 0,
      itemsPerPage: 0,
      totalItems: 0,
      totalPages: 0,
    }

  },
  dispatchers: {},
}


export const AdminPageStore = React.createContext(initialAdminContextValues)

export * from './hooks'
