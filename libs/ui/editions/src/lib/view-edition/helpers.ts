import { EditionCellData, EditionRowTitle, EditionStore } from '../store';
import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionUnit } from '@frontend/domain';
import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export function getRows(store: EditionStore): EditionRowTitle[] {
  const numRows = store.get_no_rows();
  return new Array(numRows)
    .fill(0)
    .map((_, rowIndex) => store.build_row(rowIndex));
}

export function getCells(store: EditionStore): EditionCellData[][] {
  const numRows = store.get_no_rows();
  const numCols = store.get_no_manuscripts();
  return new Array(numRows)
    .fill(0)
    .map((_, rowIndex) =>
      new Array(numCols)
        .fill(0)
        .map((_, colIndex) => store.build_cell(rowIndex, colIndex))
    );
}

export async function fetchEditionUpdateByChangeType(
  editionId: string,
  updateInfo: IPageUnitsUpdate,
  accessToken?: string | null
): Promise<IEditionUnit[]> {
  const updatedUnits = [
    ...updateInfo.Update.map((u) => u.Id),
    ...updateInfo.Create.map((u) => u.Id),
  ];
  const { data } = await axios.get<IEditionUnit[]>(
    `/server/api/v1/Editions/${editionId}/Update`,
    {
      params: {
        ManuscriptId: updateInfo.ManuscriptId,
        UpdatedUnits: updatedUnits,
      },
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}

export async function fetchEditionUpdateByPage(
  editionId: string,
  manuscriptId: string,
  pageNumber: number,
  accessToken?: string | null
): Promise<IEditionUnit[]> {
  const { data } = await axios.get<IEditionUnit[]>(
    `/server/api/v1/Editions/${editionId}/Update`,
    {
      params: {
        ManuscriptId: manuscriptId,
        PageNumber: pageNumber,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
}
