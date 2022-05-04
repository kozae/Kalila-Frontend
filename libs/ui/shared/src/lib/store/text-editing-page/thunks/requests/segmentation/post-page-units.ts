import { IUnitSummary } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getUnitParams } from '../helpers';
import axios from 'axios';

export interface IUnitUpdate {
  Id: string;
  BookUnitId: string;
  ManuscriptId: string;
  Chapter: string;
  Type: string;
  StartsInPageNumber: number;
  StartsInLineNumber: number;
  FirstTokenOrderInLine: number;
  EndsInPageNumber?: number;
  EndsInLineNumber?: number;
  LastTokenOrderInLine?: number;
}

export interface IPageUnitsUpdate {
  Create: IUnitUpdate[];
  Update: IUnitUpdate[];
  Delete: string[];
  ManuscriptId: string;
}

export async function postPageUnits(
  changes: {
    newUnits: IUnitSummary[];
    updatedUnits: IUnitSummary[];
    deletedUnits: string[];
  },
  state: RootState
) {
  const { accessToken, manuscriptId } = getUnitParams(state);
  await postPageUnitsHTTP(
    {
      Create: changes.newUnits.map((u) => prepareUpdate(u, manuscriptId)),
      Update: changes.updatedUnits.map((u) => prepareUpdate(u, manuscriptId)),
      Delete: changes.deletedUnits,
      ManuscriptId: manuscriptId,
    },
    accessToken
  );
}

async function postPageUnitsHTTP(
  update: IPageUnitsUpdate,
  accessToken?: string | null
) {
  await axios.post('/server/api/v1/ManuscriptUnit/PageUnits', update, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function prepareUpdate(u: IUnitSummary, manuscriptId: string): IUnitUpdate {
  return {
    Id: u.Id,
    BookUnitId: u.BookUnitId,
    ManuscriptId: manuscriptId,
    Chapter: u.Chapter,
    Type: u.Type,
    StartsInPageNumber: u.StartsInPageNumber,
    StartsInLineNumber: u.StartsInLineNumber,
    FirstTokenOrderInLine: u.FirstTokenOrderInLine,
    EndsInPageNumber: u.EndsInPageNumber,
    EndsInLineNumber: u.EndsInLineNumber,
    LastTokenOrderInLine: u.LastTokenOrderInLine,
  };
}
