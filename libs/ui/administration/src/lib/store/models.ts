import {IEditor} from "@frontend/shared-ui";

export interface IAdministrationState {
  loggedUser: string,
  editors: IEditor[],
  documents: { [key: string]: any }[],
  totalCount: string,
  pageSize: number,
  currentPage: number
}

export interface IAdministrationDispatchers {

}
