import { RootState } from '@frontend/shared-ui';
import { createSelector } from '@reduxjs/toolkit';

const selectSessionState = (state: RootState) => state.session;

export const selectAccessToken = createSelector(
  selectSessionState,
  (state) => state.accessToken
);

export const selectSessionStatus = createSelector(
  selectSessionState,
  (state) => state.status
);

export const selectUser = createSelector(selectSessionState, (state) => {
  if (state.session.session?.user) {
    const { name, username, roles } = state.session.user;
    return { name, username, roles };
  }
  return { name: null, username: null, roles: null };
});
