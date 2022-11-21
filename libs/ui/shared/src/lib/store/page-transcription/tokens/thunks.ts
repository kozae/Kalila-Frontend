import { createAsyncThunk } from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { flattenDeep } from 'lodash';

export interface IReplaceLineTokensPayload {
  LineId: string;
  LineOrder: number;
  newTokens: IToken[];
}

export const replaceLinesTokens = createAsyncThunk<
  { data: IReplaceLineTokensPayload[] },
  { data: IReplaceLineTokensPayload[] },
  ThunkApi
>('tokens/replaceLinesTokens', async ({ data }, { getState }) => {
  return { data };
});
