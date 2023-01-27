import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

export interface IPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export const defaultPagination: IPagination = {
  itemsPerPage: 10,
  currentPage: 1,
  totalItems: 0,
  totalPages: 0,
};

export function getPagination(
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
) {
  if (headers['pagination']) {
    return JSON.parse(headers['pagination']) as IPagination;
  }
  return undefined;
}
