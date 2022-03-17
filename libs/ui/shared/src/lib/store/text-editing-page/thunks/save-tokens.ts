import { createAsyncThunk } from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { postTokens } from './requests/tokens';

export const saveTokenChanges = createAsyncThunk<
  {
    Tokens: (IToken & { LineId: string })[];
  },
  any,
  ThunkApi
>(saveThunk.tokenChanges, async ({}, { getState }) => {
  const state = getState();
  await postTokens(state);
  return {
    Tokens: Object.values(state.tokens.entities) as (IToken & {
      LineId: string;
    })[],
  };
});
