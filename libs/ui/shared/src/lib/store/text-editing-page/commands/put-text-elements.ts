import axios from 'axios';
import { ITextElement } from '@frontend/domain';
import { RootState } from '../../config';
import { getParams, PageParams } from './helpers';
import { cleanObject, renameKey } from '@frontend/util';

export async function putTextElements(state: RootState) {
  const TextElements: Array<
    Omit<ITextElement, 'Lines' | '_id'> & { Id: string }
  > = [];
  state.textEditingPageState.putTextElements.forEach((id) => {
    TextElements.push(
      cleanObject(
        renameKey(state.textElements.entities[id], '_id', 'Id')
      ) as Omit<ITextElement, 'Lines' | '_id'> & { Id: string }
    );
  });

  if (TextElements.length === 0) {
    return;
  }

  await putTextElementsHTTP(TextElements, getParams(state));
}

async function putTextElementsHTTP(
  data: Array<Omit<ITextElement, 'Lines' | '_id'> & { Id: string }>,
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/TextElements', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
