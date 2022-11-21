import { ApiClient, IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionBookUnit, IEditionUnit } from '@frontend/domain';
import { paramsSerializer } from '@frontend/util';

export async function fetchEditionUpdateByUnitList(
  editionId: string,
  updateInfo: IPageUnitsUpdate
): Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }> {
  const updatedUnits = [
    ...updateInfo.Update.map((u) => u.Id),
    ...updateInfo.Create.map((u) => u.Id),
  ];
  try {
    const { data } = await ApiClient().get<{
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
      headers: {},
    });

    return data;
  } catch (e) {
    throw e;
  }
}

export async function fetchEditionUpdateByPage(
  editionId: string,
  manuscriptId: string,
  pageNumber: number
): Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }> {
  try {
    const { data } = await ApiClient().get<{
      Id: string;
      Changes: IEditionUnit[];
      Lacunae: number[];
    }>(`${process.env['NEXT_PUBLIC_API_URL']}Edition/Changes`, {
      params: {
        Id: editionId,
        UpdatedManuscriptId: manuscriptId,
        UpdatedPageNumber: pageNumber,
      },
      headers: {},
    });

    return data;
  } catch (e) {
    throw e;
  }
}

export const fetchEditionBookUnits = (params: { Id: string }) => {
  return ApiClient()
    .get<{ Id: string; Units: IEditionBookUnit[] }>(
      `${process.env['NEXT_PUBLIC_API_URL']}Edition/BookUnits`,
      {
        params,
        paramsSerializer,
        headers: {},
      }
    )
    .then((r) => r.data)
    .catch((e) => {
      throw e;
    });
};
