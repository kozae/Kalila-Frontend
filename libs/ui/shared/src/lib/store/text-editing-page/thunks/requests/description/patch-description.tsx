import { IPageDescription, PageDescription } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { ApiClient } from '../../../../../util';

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
      AdditionalCommentary: data.AdditionalCommentary,
      Pagination: !isNaN(pagination) ? pagination : undefined,
      FacsimileImageUrl: data.FacsimileImageUrl.replace(
        process.env['NEXT_PUBLIC_IMAGE_URL'] ?? '',
        ''
      ),
    },
    getParams(state)
  );
}

async function patchDescriptionHTTP(
  data: Partial<IPageDescription>,
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().patch(
    `${process.env['NEXT_PUBLIC_API_URL']}PageDescription/One`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {},
    }
  );
}
