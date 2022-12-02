import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISession, IUser } from '@frontend/util';


export interface ISessionState {
  session: ISession | null;
  authenticated: boolean;
  navControlBar: boolean;
  maxWidthEnabled: boolean;
  users: IUser[];
}

const initialState: ISessionState = {
  session: null,
  authenticated: false,
  navControlBar: true,
  maxWidthEnabled: false,
  users: [],
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: (
      state,
      action: PayloadAction<
        Omit<ISessionState, 'navControlBar' | 'maxWidthEnabled' | 'users'>
      >
    ) => {
      state.session = action.payload.session;
      state.authenticated = action.payload.authenticated;
    },
    loadUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
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
  loadUsers,
} = sessionSlice.actions;
