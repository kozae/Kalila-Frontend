import React from "react";
import {IPaginatedDocuments} from "./models";

const initialPaginatedDocumentsStore: IPaginatedDocuments = {
  state: undefined,
  dispatchers: undefined,
}


export const PaginatedDocumentsStore = React.createContext(initialPaginatedDocumentsStore)

export * from './hooks'
