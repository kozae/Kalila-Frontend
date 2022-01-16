import {Reducer} from "react";
import {AdminDocumentAction, AdminDocumentActionType} from "./actions";


export const AdminDocumentsReducer: Reducer<{ [key: string]: any }[], AdminDocumentAction> = (state, action) => {
  switch (action.type) {
    case AdminDocumentActionType.Load:
      return action.payload.documents
    case AdminDocumentActionType.Create:
      break;
    case AdminDocumentActionType.UserUpdate:
      break;
    case AdminDocumentActionType.SignalRUpdate:
      break;
    case AdminDocumentActionType.Delete:
      break;

  }
  return state
}
