import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { cleanObject, defaultPagination, IPagination } from '@frontend/util';
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
import { ParsedUrlQuery } from 'querystring';
import { IEditor } from '../../../../shared/src/lib/hooks';

type Doc = Record<string | 'Id', any>;

interface State {
  activityName: string;
  loading?: boolean;
  pagination: IPagination;
  filter: Record<string, any>;
  sort: { OrderBy?: string; SortDirection?: string };
  selection: string[];
  editors: IEditor[];
}

export const pagedDocsAdapter = createEntityAdapter<Doc>({
  selectId: (doc) => doc['Id'],
});

const initialState = pagedDocsAdapter.getInitialState<State>({
  loading: false,
  pagination: defaultPagination,
  activityName: '',
  filter: {},
  sort: {},
  selection: [],
  editors: [
    {
      username: 'mk',
      name: 'Mahmoud Kozae',
    },
    {
      username: 'ds',
      name: 'Dima Sakran',
    },
  ],
});

export const pagedDocsSlice = createSlice({
  name: 'pagedDocuments',
  initialState,
  reducers: {
    queryChanged(
      state,
      action: PayloadAction<{
        query: ParsedUrlQuery;
      }>
    ) {
      const { PageSize, PageNumber, OrderBy, SortDirection, ...rest } =
        action.payload.query;
      state.filter = cleanObject(rest);
      state.sort = {
        OrderBy: OrderBy as string,
        SortDirection: SortDirection as string,
      };
    },
    addToSelection(state, action: PayloadAction<{ id: string }>) {
      state.selection.push(action.payload.id);
    },
    removeFromSelection(state, action: PayloadAction<{ id: string }>) {
      const index = state.selection.indexOf(action.payload.id);
      if (index > -1) {
        state.selection.splice(index, 1); // 2nd parameter means remove one item only
      }
    },
    clearSelection(state) {
      state.selection = [];
    },
    docsLoading(state) {
      state.loading = true;
    },
    docsLoaded(
      state,
      action: PayloadAction<{
        docs: Doc[];
        pagination: IPagination;
        activityName: string;
      }>
    ) {
      pagedDocsAdapter.setAll(state, action.payload.docs);
      state.loading = false;
      state.activityName = action.payload.activityName;
      state.pagination = action.payload.pagination;
    },
    docsCleared: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(changePagination.fulfilled, () => {});
    builder.addCase(changeSort.fulfilled, () => {});
    builder.addCase(changeFilter.fulfilled, () => {});
    builder.addCase(clearFilter.fulfilled, () => {});
    builder.addCase(createDocument.fulfilled, () => {});
    builder.addCase(updateDocuments.fulfilled, () => {});
    builder.addCase(updateOneDocument.fulfilled, () => {});
    builder.addCase(adminUpdateDocuments.fulfilled, () => {});
    builder.addCase(deleteDocument.fulfilled, () => {});
  },
});

export const {
  queryChanged,
  addToSelection,
  removeFromSelection,
  clearSelection,
  docsLoading,
  docsLoaded,
  docsCleared,
} = pagedDocsSlice.actions;
