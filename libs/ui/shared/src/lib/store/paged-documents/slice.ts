import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { defaultPagination, IPagination } from '@frontend/util';

type Doc = Record<string | 'Id', any>;

interface State {
  loading?: boolean;
  pagination: IPagination;
}

export const pagedDocsAdapter = createEntityAdapter<Doc>({
  selectId: (doc) => doc['Id'],
});

export const pagedDocsSlice = createSlice({
  name: 'pagedDocuments',
  initialState: pagedDocsAdapter.getInitialState<State>({
    loading: false,
    pagination: defaultPagination,
  }),
  reducers: {
    docsLoading(state) {
      state.loading = true;
    },
    docsLoaded(
      state,
      action: PayloadAction<{ docs: Doc[]; pagination: IPagination }>
    ) {
      pagedDocsAdapter.setAll(state, action.payload.docs);
      state.loading = false;
      state.pagination = action.payload.pagination;
    },
    docsCleared: pagedDocsAdapter.removeAll,
  },
});

export const { docsLoading, docsLoaded, docsCleared } = pagedDocsSlice.actions;
