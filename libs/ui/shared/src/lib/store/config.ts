import { configureStore } from '@reduxjs/toolkit';
import { pagedDocsSlice } from './paged-documents';
import { sessionSlice } from './session';
import { pageInfoSlice } from './page-transcription/page-info';
import { imageElementsSlice } from './page-transcription/image-elements';
import { linesSlice } from './page-transcription/lines';
import { textElementsSlice } from './page-transcription/text-elements';
import { tokenSlice } from './page-transcription/tokens';
import { unitSummariesSlice } from './page-transcription/units-summary';

export const store = configureStore({
  reducer: {
    [pagedDocsSlice.name]: pagedDocsSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    [pageInfoSlice.name]: pageInfoSlice.reducer,
    [imageElementsSlice.name]: imageElementsSlice.reducer,
    [linesSlice.name]: linesSlice.reducer,
    [textElementsSlice.name]: textElementsSlice.reducer,
    [tokenSlice.name]: tokenSlice.reducer,
    [unitSummariesSlice.name]: unitSummariesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: false,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type ThunkApi = { state: RootState; dispatch: AppDispatch };
