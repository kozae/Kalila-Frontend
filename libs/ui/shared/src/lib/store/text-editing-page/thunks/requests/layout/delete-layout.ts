import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { ApiClient } from '../../../../../util';

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
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().request({
    url: `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Layout`,
    method: 'DELETE',
    data,
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {},
  });
}
