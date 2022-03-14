import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILine, IToken } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { deleteLines, postLines, putLines } from './requests';
import { omit } from 'lodash';

export const saveTokenChanges = createAsyncThunk<
  {
    Tokens: (IToken & { LineId: string })[];
  },
  any,
  ThunkApi
>(saveThunk.tokenChanges, async ({}, { getState }) => {
  return {
    Tokens: [],
  };
});
