import { ITextElement } from '@frontend/domain';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { cleanObject } from '@frontend/util';
import { ApiClient } from '../../../../../util';

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
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().put(
    `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/TextElements`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {},
    }
  );
}
