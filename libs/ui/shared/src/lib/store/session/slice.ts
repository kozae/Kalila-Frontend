import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISessionState {
  session: any;
  status: string;
  accessToken: string | null;
}

const initialState: ISessionState = {
  session: null,
  status: 'unauthenticated',
  accessToken: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: (state, action: PayloadAction<ISessionState>) => {
      state.session = action.payload.session;
      state.status = action.payload.status;
      state.accessToken = action.payload.accessToken;
    },
    clearSession: (state) => {
      state.session = initialState.session;
    },
  },
});

export const { loadSession, clearSession } = sessionSlice.actions;
