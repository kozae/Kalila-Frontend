import React from "react";
import {IAdministrationDispatchers, IAdministrationState} from "./models";
import {IStore} from "@frontend/util";


const initialAdminContextValues: IStore<IAdministrationState, IAdministrationDispatchers, {}> = {
  state: {
    loggedUser: '',
    editors: [],
    documents: []
  },
  dispatchers: {},
  selectors: {}
}


export const AdminStore = React.createContext(initialAdminContextValues)
