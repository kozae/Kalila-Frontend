import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../config';

const selectSessionState = (state: RootState) => state.session;

export const selectAccessToken = createSelector(
  selectSessionState,
  (state) => state.session.accessToken
);

export const selectSessionStatus = createSelector(
  selectSessionState,
  (state) => state.session.status
);

export const selectUser = createSelector(selectSessionState, (state) => {
  if (state.session.session?.user) {
    const { name, username, roles } = state.session.session.user;
    return { name, username, roles };
  }
  return { name: null, username: null, roles: null };
});
