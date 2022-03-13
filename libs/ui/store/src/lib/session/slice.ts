import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KalilaSessionContextValue } from '@frontend/util';

interface ISessionState {
  session: KalilaSessionContextValue;
}

const initialState: ISessionState = {
  session: { session: null, status: 'unauthenticated', accessToken: null },
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loadSession: {
      reducer: (state, action: PayloadAction<KalilaSessionContextValue>) => {
        state.session = action.payload;
      },
      prepare: (value?: KalilaSessionContextValue) => ({
        payload: value || initialState.session,
      }),
    },
    clearSession: (state) => {
      state.session = initialState.session;
    },
  },
});

export const { loadSession, clearSession } = sessionSlice.actions;
