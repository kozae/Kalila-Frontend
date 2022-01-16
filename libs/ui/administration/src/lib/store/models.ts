import {IEditor} from "@frontend/shared-ui";
import {ActivitySchema, IPagination} from "@frontend/util";

export interface IAdministrationState {
  loggedUser?: string | null,
  editors: IEditor[],
  documents: { [key: string]: any }[],
  schema?: ActivitySchema
  pagination: IPagination,
}

export interface IAdministrationDispatchers {

}
