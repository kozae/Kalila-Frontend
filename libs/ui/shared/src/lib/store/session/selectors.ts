import { createSelector } from '@reduxjs/toolkit';
import { SessionState } from './slice';

const selectSessionState = (state: SessionState) => state.session;

export const selectAccessToken = createSelector(
  selectSessionState,
  (state) => state.session?.AccessToken
);

export const selectSessionStatus = createSelector(
  selectSessionState,
  (state) => state.authenticated
);

export const selectNavControlBarIsShown = createSelector(
  selectSessionState,
  (state) => state.navControlBar
);
export const selectMaxWidthIsEnabled = createSelector(
  selectSessionState,
  (state) => state.maxWidthEnabled
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

export const selectUserPictures = createSelector(
  [selectSessionState, (state, username: string) => username],
  (state, username) => {
    const user = state.users.find((u) => u.username === username);
    return user?.picture;
  }
);
