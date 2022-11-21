import { IImageElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';
import { ApiClient } from '../../../../../util';

export async function putImages(state: RootState) {
  const Images: Array<IImageElement> = [];
  state.textEditingPageState.putImages.forEach((id) => {
    Images.push(
      cleanObject({
        ...state.imageElements.entities[id],
        Id: id,
      }) as IImageElement
    );
  });

  if (Images.length === 0) {
    return;
  }

  await putImagesHTTP(Images, getParams(state));
}

async function putImagesHTTP(
  data: Array<IImageElement>,
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().put(
    `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Images`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {},
    }
  );
}
