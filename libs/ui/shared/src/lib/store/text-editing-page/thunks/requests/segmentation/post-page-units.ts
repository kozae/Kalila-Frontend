import { IUnitSummary } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getUnitParams } from '../helpers';
import { ApiClient } from '../../../../../util';

export interface IUnitUpdate {
  Id: string;
  BookUnitId: string;
  ManuscriptId: string;
  Type: string;
  Lacuna: boolean;
  Tags: string[];
  Start: [number, number, number];
  End: [number, number, number];
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
  state: RootState,
  lacunae?: IUnitSummary[]
) {
  const { manuscriptId } = getUnitParams(state);
  await postPageUnitsHTTP({
    Create: lacunae
      ? [...changes.newUnits, ...lacunae].map((u) =>
          prepareUpdate(u, manuscriptId)
        )
      : changes.newUnits.map((u) => prepareUpdate(u, manuscriptId)),
    Update: changes.updatedUnits.map((u) => prepareUpdate(u, manuscriptId)),
    Delete: changes.deletedUnits,
    ManuscriptId: manuscriptId,
  });
}

async function postPageUnitsHTTP(update: IPageUnitsUpdate) {
  await ApiClient().post(
    `${process.env['NEXT_PUBLIC_API_URL']}ManuscriptUnit/PageUnits`,
    update,
    {
      headers: {},
    }
  );
}

function prepareUpdate(u: IUnitSummary, manuscriptId: string): IUnitUpdate {
  return {
    Id: u.Id,
    BookUnitId: u.BookUnitId,
    ManuscriptId: manuscriptId,
    Type: u.Type,
    Lacuna: u.Lacuna ?? false,
    Tags: [],
    Start: u.Start,
    End: u.End,
  };
}
