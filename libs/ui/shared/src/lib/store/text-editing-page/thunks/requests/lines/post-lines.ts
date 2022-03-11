import { RootState } from '../../../../config';
import { ILine } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { groupBy, omit } from 'lodash';
import ObjectID from 'bson-objectid';
import { getParams, PageParams } from '../helpers';
import axios from 'axios';

export async function postLines(state: RootState) {
  if (state.textEditingPageState.postLines.length === 0) {
    return { Lines: [], Ids: [] };
  }

  const Lines: Array<
    Omit<ILine, 'Tokens' | '_id'> & { ElementId: string; Id: string }
  > = [];
  state.textEditingPageState.postLines.forEach((id) => {
    Lines.push(
      cleanObject({
        ...omit(state.lines.entities[id], '_id'),
        Id: ObjectID().toString(),
      }) as Omit<ILine, 'Tokens' | '_id'> & { ElementId: string; Id: string }
    );
  });

  const params = getParams(state);
  for (const [ElementId, ElementLines] of Object.entries(
    groupBy(Lines, (l) => l.ElementId)
  )) {
    await postLinesHTTP(
      {
        ElementId,
        Lines: ElementLines.map((l) => omit(l, 'ElementId')),
      },
      params
    );
  }

  return { Lines, Ids: state.textEditingPageState.postLines };
}

async function postLinesHTTP(
  data: {
    ElementId: string;
    Lines: (Omit<ILine, 'Tokens' | '_id'> & { Id: string })[];
  },
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.post('/server/api/v1/PageTranscription/Lines', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
