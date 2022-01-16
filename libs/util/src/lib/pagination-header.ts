import {AxiosResponseHeaders} from "axios";

export interface IPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}


export function getPagination(headers: AxiosResponseHeaders) {
  if (headers['pagination']) {
    return JSON.parse(headers['pagination']) as IPagination
  }
  return {}
}
