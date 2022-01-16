import {IRealTimeUpdate} from "@frontend/shared-ui";

export enum AdminDocumentActionType {
  Load = "Load",
  Create = "Create",
  UserUpdate = "UserUpdate",
  SignalRUpdate = "SignalRUpdate",
  Delete = "Delete",
}

export interface ILoadAction {
  type: AdminDocumentActionType.Load,
  payload: { documents: { [key: string]: any }[] }
}

export interface ICreateAction {
  type: AdminDocumentActionType.Create,
  payload: { document: { [key: string]: any } }
}

export interface IUserUpdateAction {
  type: AdminDocumentActionType.UserUpdate,
  payload: { update: { [key: string]: any }, params: { [key: string]: any } }
}

export interface ISignalRUpdateAction {
  type: AdminDocumentActionType.SignalRUpdate,
  payload: IRealTimeUpdate
}

export interface IDeleteAction {
  type: AdminDocumentActionType.Delete,
  payload: { id: string }
}

export type AdminDocumentAction =
  ILoadAction
  | ICreateAction
  | IUserUpdateAction
  | ISignalRUpdateAction
  | IDeleteAction
