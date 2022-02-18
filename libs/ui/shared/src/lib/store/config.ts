import { configureStore } from '@reduxjs/toolkit';
import { pagedDocsSlice } from './paged-documents';
import { sessionSlice } from './session';

export const store = configureStore({
  reducer: {
    [pagedDocsSlice.name]: pagedDocsSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
  },
  devTools: false,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type ThunkApi = { state: RootState; dispatch: AppDispatch };
