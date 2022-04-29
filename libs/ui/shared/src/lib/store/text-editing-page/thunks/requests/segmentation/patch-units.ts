import { IUnitSummary } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getUnitParams } from '../helpers';
import axios from 'axios';

export async function patchUnits(units: IUnitSummary[], state: RootState) {
  const { accessToken, manuscriptId } = getUnitParams(state);

  await patchUnitsHTTP(
    units.map((u) => ({ ...u, ManuscriptId: manuscriptId })),
    accessToken
  );
}

async function patchUnitsHTTP(
  data: (IUnitSummary & { ManuscriptId: string })[],
  accessToken: string | null
) {
  await axios.patch('/server/api/v1/ManuscriptUnit', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
