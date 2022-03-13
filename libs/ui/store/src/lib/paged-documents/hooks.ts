import { IPagination, MediaTypes } from '@frontend/util';
import { getDocuments } from './swr-requests';
import { KalilaDocument } from '@frontend/domain';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  addToSelection,
  clearSelection,
  docsCleared,
  docsLoaded,
  docsLoading,
  queryChanged,
  removeFromSelection,
} from './slice';
import { selectAccessToken } from '../session';
import {
  selectFilter,
  selectPagedDocs,
  selectPagedDocsLoading,
  selectPagination,
  selectSelection,
  selectSort,
} from './selectors';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ParsedUrlQuery } from 'querystring';
import {
  adminUpdateDocuments,
  changeFilter,
  changePagination,
  changeSort,
  clearFilter,
  createDocument,
  deleteDocument,
  updateDocuments,
  updateOneDocument,
} from './thunks';
import { NextRouter } from 'next/router';
import { plainToInstance } from 'class-transformer';

function dispatchDataChangesToStore(
  isValidating: boolean,
  activityName: string,
  data: { content: any; pagination: IPagination | undefined } | undefined
) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isValidating) {
      dispatch(docsLoading());
    } else if (data) {
      dispatch(
        docsLoaded({
          activityName,
          docs: data.content,
          pagination: data.pagination as IPagination,
        })
      );
    }
  }, [data, isValidating]);
}

function clearDocOnUnmount() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(docsCleared());
    };
  }, []);
}

export function usePagedDocumentsStore(
  activityName: string,
  query: ParsedUrlQuery,
  mediaType: MediaTypes,
  additionalParams = {},
  routeSuffix = ''
) {
  const accessToken = useAppSelector(selectAccessToken);
  const { data, isValidating, mutate } = getDocuments(
    accessToken,
    activityName,
    query,
    mediaType,
    additionalParams,
    routeSuffix
  );

  dispatchDataChangesToStore(isValidating, activityName, data);
  clearDocOnUnmount();
  useParamsFromRouteQuery(query);
  return mutate;
}

export function usePagedDocumentsState<T extends KalilaDocument>(
  cls: ClassConstructor<T>,
  excludeFromFilter: string[] = []
) {
  return {
    loading: useAppSelector(selectPagedDocsLoading),
    documents: plainToInstance(cls, useAppSelector(selectPagedDocs)),
    pagination: useAppSelector(selectPagination),
    selection: useAppSelector(selectSelection),
    filter: useAppSelector((state) => selectFilter(state, excludeFromFilter)),
    sort: useAppSelector(selectSort),
  };
}

export function usePagedDocumentsDispatch() {
  const dispatch = useAppDispatch();
  return {
    changePagination: (pagination: IPagination, router: NextRouter) =>
      dispatch(changePagination({ pagination, router })),
    changeSort: (
      sort: { OrderBy?: string; SortDirection?: string },
      router: NextRouter
    ) => dispatch(changeSort({ sort, router })),
    changeFilter: (filter: Record<string, any>, router: NextRouter) =>
      dispatch(changeFilter({ filter, router })),
    clearFilter: (router: NextRouter) => dispatch(clearFilter({ router })),
    createDocument: (doc: Record<string, any>) => dispatch(createDocument(doc)),
    updateDocuments: (data: {
      update: Record<string, any>;
      params: Record<string, any>;
    }) => dispatch(updateDocuments(data)),
    updateOneDocument: (data: {
      update: Record<string, any>;
      params: Record<string, any>;
    }) => dispatch(updateOneDocument(data)),
    adminUpdateDocuments: (data: {
      update: Record<string, any>;
      params: Record<string, any>;
    }) => dispatch(adminUpdateDocuments(data)),
    deleteDocument: (data: { id: string; additionalParams: any }) =>
      dispatch(deleteDocument(data)),
    addToSelection: (id: string) => dispatch(addToSelection({ id })),
    removeFromSelection: (id: string) => dispatch(removeFromSelection({ id })),
    clearSelection: () => dispatch(clearSelection()),
  };
}

export type IPagedDocumentsDispatch = ReturnType<
  typeof usePagedDocumentsDispatch
>;

export function useParamsFromRouteQuery(
  query: ParsedUrlQuery,
  excludeFromFilter: string[] = []
) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(queryChanged({ query }));
    dispatch(clearSelection());
  }, [query]);
}
