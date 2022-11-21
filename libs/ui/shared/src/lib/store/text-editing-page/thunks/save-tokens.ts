import { createAsyncThunk } from '@reduxjs/toolkit';
import { IToken, IUnitSummary } from '@frontend/domain';
import { RootState, ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { postTokens } from './requests/tokens';
import {
  identifyChanges,
  nearestOpenUnitClosed,
  openedUnitFromPreviousPage,
  postPageUnits,
  processUnits,
} from './requests';
import { flattenDeep } from 'lodash';
import axios from 'axios';

export const saveTokenChanges = createAsyncThunk<
  {
    Tokens: (IToken & { LineId: string })[];
    Units: IUnitSummary[];
    nearestOpenUnitClosed: boolean;
    openedUnitFromPreviousPage?: IUnitSummary;
  },
  any,
  ThunkApi
>(saveThunk.tokenChanges, async ({}, { getState }) => {
  const state = getState();
  const morphology = await getMorphology(state);
  await postTokens(state, morphology);
  const units = processUnits(state, state.pageData.pageInfo.NearestOpenUnit);
  const changes = identifyChanges(units, state);

  await postPageUnits(changes, state);
  return {
    Tokens: Object.values(state.tokens.entities).map((t) => ({
      ...t,
      Morphology: morphology[t!.RawToken] ?? [],
    })) as (IToken & {
      LineId: string;
    })[],
    Units: [
      ...units.filter((u: any) => u.Id.length === 24),
      ...changes.newUnits,
    ],
    nearestOpenUnitClosed: nearestOpenUnitClosed(changes.updatedUnits, state),
    openedUnitFromPreviousPage: openedUnitFromPreviousPage(
      changes.updatedUnits,
      state
    ),
  };
});

export async function getMorphology(
  state: RootState
): Promise<Record<string, string[]>> {
  const rawTokens = state.textEditingPageState.postTokens.map((lineId) => {
    const tokens = Object.values(state.tokens.entities).filter(
      (t) => t && t.LineId === lineId
    ) as (IToken & { LineId: string })[];
    return tokens.map((t) => t.RawToken);
  });
  const distinctTokens = new Array(...new Set(flattenDeep(rawTokens)));
  const sentence = distinctTokens.join(' ');
  const { data } = await axios.post<Record<string, string[]>>(
    `${process.env['NEXT_PUBLIC_API_URL']}Morphology`,
    {
      Sentence: sentence,
    }
  );
  return data;
}
