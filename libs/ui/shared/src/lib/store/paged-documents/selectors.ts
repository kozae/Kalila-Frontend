import { createSelector } from '@reduxjs/toolkit';
import { pagedDocsAdapter, RootState } from "@frontend/shared-ui";

const selectPagedDocsState = (state: RootState) => state.pagedDocuments;

export const {
  selectAll: selectPagedDocs,
  selectById: selectPagedDocById,
  selectEntities: selectPagedDocsAsMap,
} = pagedDocsAdapter.getSelectors<RootState>(selectPagedDocsState);


export const selectPagedDocsLoading = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.loading
);

export const selectPagination = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.pagination
);
