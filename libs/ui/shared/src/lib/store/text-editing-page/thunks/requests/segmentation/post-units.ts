import { IUnitSummary } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getUnitParams } from '../helpers';
import axios from 'axios';

export interface IUnitCreation {
  Id: string;
  BookUnitId: string;
  ManuscriptId: string;
  Chapter: string;
}

export async function postUnits(units: IUnitSummary[], state: RootState) {
  const { accessToken, manuscriptId } = getUnitParams(state);

  await postUnitsHTTP(
    units.map((u) => ({ ...u, ManuscriptId: manuscriptId })),
    accessToken
  );
}

async function postUnitsHTTP(
  data: (IUnitSummary & { ManuscriptId: string })[],
  accessToken: string | null
) {
  await axios.post('/server/api/v1/ManuscriptUnit', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
