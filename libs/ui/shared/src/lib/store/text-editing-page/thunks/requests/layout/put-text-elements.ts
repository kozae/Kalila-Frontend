import axios from 'axios';
import { ITextElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';

export async function putTextElements(state: RootState) {
  const TextElements: Array<Omit<ITextElement, 'Lines'>> = [];
  state.textEditingPageState.putTextElements.forEach((id) => {
    TextElements.push(
      cleanObject({
        ...state.textElements.entities[id],
        Id: id,
      }) as Omit<ITextElement, 'Lines'>
    );
  });

  if (TextElements.length === 0) {
    return;
  }

  await putTextElementsHTTP(TextElements, getParams(state));
}

async function putTextElementsHTTP(
  data: Array<Omit<ITextElement, 'Lines'>>,
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/TextElements', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
