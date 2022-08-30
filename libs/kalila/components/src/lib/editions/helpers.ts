import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionUnit } from '@frontend/domain';
import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export async function fetchEditionUpdateByUnitList(
  editionId: string,
  updateInfo: IPageUnitsUpdate,
  accessToken?: string | null
): Promise<IEditionUnit[]> {
  const updatedUnits = [
    ...updateInfo.Update.map((u) => u.Id),
    ...updateInfo.Create.map((u) => u.Id),
  ];
  const { data } = await axios.get<{ Id: string; Changes: IEditionUnit[] }>(
    `${process.env['NEXT_PUBLIC_API_URL']}Edition/Changes`,
    {
      params: {
        Id: editionId,
        UpdatedManuscriptId: updateInfo.ManuscriptId,
        UpdatedUnitIds: updatedUnits,
      },
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.Changes;
}

export async function fetchEditionUpdateByPage(
  editionId: string,
  manuscriptId: string,
  pageNumber: number,
  accessToken?: string | null
): Promise<IEditionUnit[]> {
  const { data } = await axios.get<{ Id: string; Changes: IEditionUnit[] }>(
    `${process.env['NEXT_PUBLIC_API_URL']}Edition/Changes`,
    {
      params: {
        Id: editionId,
        UpdatedManuscriptId: manuscriptId,
        UpdatedPageNumber: pageNumber,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data.Changes;
}
