import {IEditor, IRealTimeUpdate} from "@frontend/shared-ui";
import {ActivitySchema, IPagination, IStore} from "@frontend/util";


export interface IAdministrationState {
  loggedUser: string | null,
  editors: IEditor[],
  documents: { [key: string]: any }[],
  schema: ActivitySchema
  pagination: IPagination
}

export interface IAdministrationDispatchers {
  createDocument: (doc: { [p: string]: any }) => Promise<void>,
  processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>,
  updateDocument: (update: {[p: string]: any}, params: {[p: string]: any}) => Promise<void>,
  deleteDocument: (id: string) => Promise<void>
}

export type IAdminPageStore = IStore<IAdministrationState | undefined, IAdministrationDispatchers | undefined>;
