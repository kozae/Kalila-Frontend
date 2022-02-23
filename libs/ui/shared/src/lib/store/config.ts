import { configureStore } from '@reduxjs/toolkit';
import { pagedDocsSlice } from './paged-documents';
import { sessionSlice } from './session';
import { pageDataSlice } from './page-transcription/page-data';
import { imageElementsSlice } from './page-transcription/image-elements';
import { linesSlice } from './page-transcription/lines';
import { textElementsSlice } from './page-transcription/text-elements';
import { tokenSlice } from './page-transcription/tokens';
import { unitSummariesSlice } from './page-transcription/units-summary';
import { attributesSlice } from './schema/attributes';
import { fieldsSlice } from './schema/fields';
import { regionDataUrlsSlice } from './page-transcription/region-data-urls';

export const store = configureStore({
  reducer: {
    [sessionSlice.name]: sessionSlice.reducer,
    [fieldsSlice.name]: fieldsSlice.reducer,
    [attributesSlice.name]: attributesSlice.reducer,
    [pagedDocsSlice.name]: pagedDocsSlice.reducer,
    [pageDataSlice.name]: pageDataSlice.reducer,
    [regionDataUrlsSlice.name]: regionDataUrlsSlice.reducer,
    [imageElementsSlice.name]: imageElementsSlice.reducer,
    [linesSlice.name]: linesSlice.reducer,
    [textElementsSlice.name]: textElementsSlice.reducer,
    [tokenSlice.name]: tokenSlice.reducer,
    [unitSummariesSlice.name]: unitSummariesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type ThunkApi = { state: RootState; dispatch: AppDispatch };
