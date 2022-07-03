import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISession } from '@frontend/util';

export interface ISessionState {
  session: ISession | null;
  authenticated: boolean;
}

const initialState: ISessionState = {
  session: null,
  authenticated: false,
};

const userMap: { [key: string]: string } = { 'mahmoud.kozae': 'mk' };

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: (state, action: PayloadAction<ISessionState>) => {
      state.session = action.payload.session;
      state.authenticated = action.payload.authenticated;
      if (state.session !== null) {
        state.session.Username = userMap[state.session.Username];
      }
    },
    clearSession: (state) => {
      state.session = null;
      state.authenticated = false;
    },
  },
});

export const { loadSession, clearSession } = sessionSlice.actions;
