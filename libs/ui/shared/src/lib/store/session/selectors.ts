import { RootState } from '@frontend/shared-ui';
import { createSelector } from '@reduxjs/toolkit';

const selectSessionState = (state: RootState) => state.session;

export const selectAccessToken = createSelector(
  selectSessionState,
  (state) => state.session?.AccessToken
);

export const selectSessionStatus = createSelector(
  selectSessionState,
  (state) => state.authenticated
);

export const selectUser = createSelector(selectSessionState, (state) => {
  if (state.session) {
    return {
      name: state.session.Name,
      username: state.session.Username,
      roles: state.session.Roles,
    };
  }
  return { name: null, username: null, roles: null };
});
