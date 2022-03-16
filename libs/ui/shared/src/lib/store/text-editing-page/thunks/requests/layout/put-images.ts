import axios from 'axios';
import { IImageElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';

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
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/Images', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
