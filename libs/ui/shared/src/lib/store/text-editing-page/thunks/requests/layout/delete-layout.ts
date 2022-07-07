import axios from 'axios';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';

export async function deleteLayout(state: RootState) {
  if (
    state.textEditingPageState.deleteLayoutImages.length === 0 &&
    state.textEditingPageState.deleteLayoutTextElements.length === 0
  ) {
    return;
  }
  await deleteLayoutHTTP(
    {
      TextElementIds: state.textEditingPageState.deleteLayoutTextElements,
      ImageIds: state.textEditingPageState.deleteLayoutImages,
    },
    getParams(state)
  );
}

async function deleteLayoutHTTP(
  data: {
    ImageIds: string[];
    TextElementIds: string[];
  },
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.request({
    url: `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Layout`,
    method: 'DELETE',
    data,
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
