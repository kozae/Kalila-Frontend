import {IRealTimeUpdate} from "@frontend/shared-ui";
import {ActivitySchema, IPagination, IStore} from "@frontend/util";


export interface IPaginatedDocumentsState<T extends object> {
  loggedUser: string | null,
  documents: T[],
  schema: ActivitySchema
  pagination: IPagination
}

export interface IPaginatedDocumentsDispatchers {
  createDocument: (doc: { [p: string]: any }) => Promise<void>,
  processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>,
  updateDocument: (update: {[p: string]: any}, params: {[p: string]: any}) => Promise<void>,
  deleteDocument: (id: string) => Promise<void>
}

export type IPaginatedDocuments<T extends object> = IStore<IPaginatedDocumentsState<T> | undefined, IPaginatedDocumentsDispatchers | undefined>;
