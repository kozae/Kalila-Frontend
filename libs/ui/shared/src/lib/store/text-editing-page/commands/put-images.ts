import axios from 'axios';
import { IImageElement } from '@frontend/domain';
import { RootState } from '../../config';
import { getParams, PageParams } from './helpers';
import { cleanObject, renameKey } from '@frontend/util';

export async function putImages(state: RootState) {
  const Images: Array<Omit<IImageElement, '_id'> & { Id: string }> = [];
  state.textEditingPageState.putImages.forEach((id) => {
    Images.push(
      cleanObject(
        renameKey(state.imageElements.entities[id], '_id', 'Id')
      ) as Omit<IImageElement, '_id'> & { Id: string }
    );
  });

  if (Images.length === 0) {
    return;
  }

  await putImagesHTTP(Images, getParams(state));
}

async function putImagesHTTP(
  data: Array<Omit<IImageElement, '_id'> & { Id: string }>,
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/Images', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
