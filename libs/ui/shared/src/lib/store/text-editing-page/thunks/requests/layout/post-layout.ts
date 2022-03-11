import axios from 'axios';
import { IImageElement, ITextElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { omit } from 'lodash';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';
import ObjectID from 'bson-objectid';

export async function postLayout(state: RootState) {
  const TextElements: Array<
    Omit<ITextElement, 'Lines' | '_id'> & { Id: string }
  > = [];
  const Images: Array<Omit<IImageElement, '_id'> & { Id: string }> = [];
  state.textEditingPageState.postLayoutTextElements.forEach((id) => {
    TextElements.push(
      cleanObject({
        ...omit(state.textElements.entities[id], '_id'),
        Id: ObjectID().toString(),
      }) as Omit<ITextElement, 'Lines' | '_id'> & { Id: string }
    );
  });
  state.textEditingPageState.postLayoutImages.forEach((id) => {
    Images.push(
      cleanObject({
        ...omit(state.imageElements.entities[id], '_id'),
        Id: ObjectID().toString(),
      }) as Omit<IImageElement, '_id'> & { Id: string }
    );
  });
  if (Images.length === 0 && TextElements.length === 0) {
    return { TextElements, TextElementIds: [], Images, ImageIds: [] };
  }

  await postLayoutHTTP({ TextElements, Images }, getParams(state));

  return {
    TextElements,
    TextElementIds: state.textEditingPageState.postLayoutTextElements,
    Images,
    ImageIds: state.textEditingPageState.postLayoutImages,
  };
}

async function postLayoutHTTP(
  data: {
    Images: Array<Omit<IImageElement, '_id'> & { Id: string }>;
    TextElements: Array<Omit<ITextElement, 'Lines' | '_id'> & { Id: string }>;
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
