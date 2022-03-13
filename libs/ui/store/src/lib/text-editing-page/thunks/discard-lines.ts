import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { sleeper } from '@frontend/util';
import { discardThunk } from './discard';

export const discardLineChanges = createAsyncThunk<
  {
    Lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  },
  any,
  ThunkApi
>(discardThunk.lineChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    Lines: state.textEditingPageState.linesBeforeChanges,
  };
});
