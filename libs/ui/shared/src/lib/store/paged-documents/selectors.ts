import { createSelector } from '@reduxjs/toolkit';
import { pagedDocsAdapter } from './slice';
import { RootState } from '../config';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';

const selectPagedDocsState = (state: RootState) => state.pagedDocuments;

export const {
  selectAll: selectPagedDocs,
  selectById: selectPagedDocById,
  selectEntities: selectPagedDocsAsMap,
} = pagedDocsAdapter.getSelectors<RootState>(selectPagedDocsState);

export const selectCastedPagedDocs = <T>(cls: ClassConstructor<T>) =>
  createSelector(selectPagedDocs, (docs) => plainToInstance(cls, docs));

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

export const selectFilter = (exclude: string[]) =>
  createSelector(selectPagedDocsState, (pagedDocsState) =>
    omit(pagedDocsState.filter, exclude)
  );

export const selectSort = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.sort
);

export const selectSelection = createSelector(
  selectPagedDocsState,
  (pagedDocsState) => pagedDocsState.selection
);

export const isIdSelected = (id: string) =>
  createSelector(selectSelection, (selection) => selection.includes(id));
