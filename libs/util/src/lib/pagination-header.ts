import {AxiosResponseHeaders} from "axios";

export interface IPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}


export function getPagination(headers: AxiosResponseHeaders) {
  return JSON.parse(headers['pagination']) as IPagination
}
