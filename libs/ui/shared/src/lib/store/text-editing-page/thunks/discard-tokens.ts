import { createAsyncThunk } from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { sleeper } from '@frontend/util';
import { discardThunk } from './discard';

export const discardTokenChanges = createAsyncThunk<
  {
    Tokens: (IToken & { LineId: string })[];
  },
  any,
  ThunkApi
>(discardThunk.tokenChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    Tokens: state.textEditingPageState.tokensBeforeChanges,
  };
});
