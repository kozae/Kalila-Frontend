import axios from 'axios';
import { IImageElement, ITextElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';
import ObjectID from 'bson-objectid';

export async function postLayout(state: RootState) {
  const TextElements: Array<Omit<ITextElement, 'Lines'>> = [];
  const Images: Array<IImageElement> = [];
  state.textEditingPageState.postLayoutTextElements.forEach((id) => {
    TextElements.push(
      cleanObject({
        ...state.textElements.entities[id],
        Id: ObjectID().toString(),
      }) as Omit<ITextElement, 'Lines'>
    );
  });
  state.textEditingPageState.postLayoutImages.forEach((id) => {
    Images.push(
      cleanObject({
        ...state.imageElements.entities[id],
        Id: ObjectID().toString(),
      }) as IImageElement
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
    Images: Array<IImageElement>;
    TextElements: Array<Omit<ITextElement, 'Lines'>>;
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
