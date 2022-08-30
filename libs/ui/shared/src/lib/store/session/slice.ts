import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISession } from '@frontend/util';

export interface ISessionState {
  session: ISession | null;
  authenticated: boolean;
  navControlBar: boolean;
  maxWidthEnabled: boolean;
}

const initialState: ISessionState = {
  session: null,
  authenticated: false,
  navControlBar: true,
  maxWidthEnabled: false,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: (
      state,
      action: PayloadAction<
        Omit<ISessionState, 'navControlBar' | 'maxWidthEnabled'>
      >
    ) => {
      state.session = action.payload.session;
      state.authenticated = action.payload.authenticated;
    },
    clearSession: (state) => {
      state.session = null;
      state.authenticated = false;
    },
    showControlBar: (state) => {
      state.navControlBar = true;
    },
    hideControlBar: (state) => {
      state.navControlBar = false;
    },
    enableMaxWidth: (state) => {
      state.maxWidthEnabled = true;
    },
    disableMaxWidth: (state) => {
      state.maxWidthEnabled = false;
    },
  },
});

export type SessionState = { [sessionSlice.name]: ISessionState };

export const {
  loadSession,
  clearSession,
  showControlBar,
  hideControlBar,
  enableMaxWidth,
  disableMaxWidth,
} = sessionSlice.actions;
