import { IPageDescription, PageDescription } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import axios from 'axios';

export async function patchDescription(
  data: PageDescription,
  state: RootState
) {
  const pagination = parseInt(data.Pagination as any);
  await patchDescriptionHTTP(
    {
      EditionProgress: data.EditionProgress,
      Foliation: data.Foliation,
      PresentPageNumbering: data.PresentPageNumbering,
      Tags: data.Tags,
      Pagination: !isNaN(pagination) ? pagination : undefined,
      FacsimileImageUrl: data.FacsimileImageUrl,
    },
    getParams(state)
  );
}

async function patchDescriptionHTTP(
  data: Partial<IPageDescription>,
  { accessToken, manuscriptId, pageId }: PageParams
) {
  console.log({ data });
  await axios.patch('/server/api/v1/PageDescription/One', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
