import { createAsyncThunk } from '@reduxjs/toolkit';
import { IToken, IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { sleeper } from '@frontend/util';
import { discardThunk } from './discard';

export const discardTokenChanges = createAsyncThunk<
  {
    Tokens: (IToken & { LineId: string })[];
    Units: IUnitSummary[];
  },
  any,
  ThunkApi
>(discardThunk.tokenChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    Tokens: state.textEditingPageState.tokensBeforeChanges,
    Units: state.textEditingPageState.unitSummariesBeforeChanges,
  };
});
