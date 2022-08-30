import { createSelector } from '@reduxjs/toolkit';
import { pagedDocsAdapter, PagedDocumentsState } from './slice';
import { omit } from 'lodash';

const selectPagedDocsState = (state: PagedDocumentsState) =>
  state.pagedDocuments;

export const {
  selectAll: selectPagedDocs,
  selectById: selectPagedDocById,
  selectEntities: selectPagedDocsAsMap,
} = pagedDocsAdapter.getSelectors<PagedDocumentsState>(selectPagedDocsState);

export const selectPagedDocsLoading = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.loading
);

export const selectEditors = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.editors
);

export const selectPagination = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.pagination
);

export const selectFilter = createSelector(
  [selectPagedDocsState, (state, exclude: string[]) => exclude],
  (pagedDocsState, exclude) => omit(pagedDocsState.filter, exclude)
);

export const selectSort = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.sort
);

export const selectSelection = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.selection
);

export const isIdSelected = createSelector(
  [selectSelection, (state, id: string) => id],
  (selection, id) => selection.includes(id)
);
