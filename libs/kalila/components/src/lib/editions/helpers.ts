import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionBookUnit, IEditionUnit } from '@frontend/domain';
import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export async function fetchEditionUpdateByUnitList(
  editionId: string,
  updateInfo: IPageUnitsUpdate,
  accessToken?: string | null
): Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }> {
  const updatedUnits = [
    ...updateInfo.Update.map((u) => u.Id),
    ...updateInfo.Create.map((u) => u.Id),
  ];
  const { data } = await axios.get<{
    Id: string;
    Changes: IEditionUnit[];
    Lacunae: number[];
  }>(`${process.env['NEXT_PUBLIC_API_URL']}Edition/Changes`, {
    params: {
      Id: editionId,
      UpdatedManuscriptId: updateInfo.ManuscriptId,
      UpdatedUnitIds: updatedUnits,
    },
    paramsSerializer,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

export async function fetchEditionUpdateByPage(
  editionId: string,
  manuscriptId: string,
  pageNumber: number,
  accessToken?: string | null
): Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }> {
  const { data } = await axios.get<{
    Id: string;
    Changes: IEditionUnit[];
    Lacunae: number[];
  }>(`${process.env['NEXT_PUBLIC_API_URL']}Edition/Changes`, {
    params: {
      Id: editionId,
      UpdatedManuscriptId: manuscriptId,
      UpdatedPageNumber: pageNumber,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

export const fetchEditionBookUnits = (
  params: { Id: string },
  accessToken?: string | number
) => {
  return axios
    .get<{ Id: string; Units: IEditionBookUnit[] }>(
      `${process.env['NEXT_PUBLIC_API_URL']}Edition/BookUnits`,
      {
        params,
        paramsSerializer,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((r) => r.data);
};
