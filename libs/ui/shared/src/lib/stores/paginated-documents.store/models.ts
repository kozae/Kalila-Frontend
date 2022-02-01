import {IRealTimeUpdate} from "@frontend/shared-ui";
import {ActivitySchema, IPagination, IStore} from "@frontend/util";
import {KalilaDocument} from "@frontend/domain";


export interface IPaginatedDocumentsState<T extends KalilaDocument> {
  loggedUser: string | null,
  documents: T[],
  schema: ActivitySchema
  pagination: IPagination
}

export interface IPaginatedDocumentsDispatchers<T extends KalilaDocument> {
  createDocument: (doc: T) => Promise<void>,
  processSignalRUpdate: (update: IRealTimeUpdate) => Promise<void>,
  updateDocument: (update: {[p: string]: any}, params: {[p: string]: any}) => Promise<void>,
  adminUpdateDocument: (update: {[p: string]: any}, params: {[p: string]: any}) => Promise<void>,
  deleteDocument: (id: string) => Promise<void>
}

export type IPaginatedDocuments<T extends KalilaDocument> = IStore<IPaginatedDocumentsState<T> | undefined, IPaginatedDocumentsDispatchers<T> | undefined>;
