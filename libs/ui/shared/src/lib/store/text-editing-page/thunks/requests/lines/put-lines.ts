import { RootState } from '../../../../config';
import { ILine } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { groupBy, omit } from 'lodash';
import { getParams, PageParams } from '../helpers';
import axios from 'axios';

export async function putLines(state: RootState) {
  if (state.textEditingPageState.putLines.length === 0) {
    return;
  }
  const Lines: Array<
    Omit<ILine, 'Tokens' | '_id'> & { ElementId: string; Id: string }
  > = [];
  state.textEditingPageState.putLines.forEach((id) => {
    Lines.push(
      cleanObject({
        ...omit(state.lines.entities[id], '_id'),
        Id: id,
      }) as Omit<ILine, 'Tokens' | '_id'> & { ElementId: string; Id: string }
    );
  });
  const params = getParams(state);
  for (const [ElementId, ElementLines] of Object.entries(
    groupBy(Lines, (l) => l.ElementId)
  )) {
    await putLinesHTTP(
      {
        ElementId,
        Lines: ElementLines.map((l) => omit(l, 'ElementId')),
      },
      params
    );
  }
}

async function putLinesHTTP(
  data: {
    ElementId: string;
    Lines: (Omit<ILine, 'Tokens' | '_id'> & { Id: string })[];
  },
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/Lines', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
