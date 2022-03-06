import axios from 'axios';
import { IImageElement, ITextElement } from '@frontend/domain';
import { RootState } from '../../config';
import { omit } from 'lodash';
import { getParams, PageParams } from './helpers';
import { cleanObject } from '@frontend/util';
import ObjectID from 'bson-objectid';

export async function postLayout(state: RootState) {
  const TextElements: Omit<ITextElement, 'Lines' | '_id'>[] = [];
  const Images: Omit<IImageElement, '_id'>[] = [];
  state.textEditingPageState.postLayoutTextElements.forEach((id) => {
    TextElements.push(
      cleanObject({
        ...omit(state.textElements.entities[id], '_id'),
        Id: ObjectID().toString(),
      }) as Omit<ITextElement, 'Lines' | '_id'>
    );
  });
  state.textEditingPageState.postLayoutImages.forEach((id) => {
    Images.push(
      cleanObject({
        ...omit(state.imageElements.entities[id], '_id'),
        Id: ObjectID().toString(),
      }) as IImageElement
    );
  });
  if (Images.length === 0 && TextElements.length === 0) {
    return { TextElements, Images };
  }

  await postLayoutHTTP({ TextElements, Images }, getParams(state));

  return { TextElements, Images };
}

async function postLayoutHTTP(
  data: {
    Images: Omit<IImageElement, '_id'>[];
    TextElements: Omit<ITextElement, 'Lines' | '_id'>[];
  },
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.post('/server/api/v1/PageTranscription/Layout', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
