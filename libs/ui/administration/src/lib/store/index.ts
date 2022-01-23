import React from "react";
import {IAdminPageStore} from "./models";

const initialAdminPageStore: IAdminPageStore = {
  state: undefined,
  dispatchers: undefined,
}


export const AdminPageStore = React.createContext(initialAdminPageStore)

export * from './hooks'
