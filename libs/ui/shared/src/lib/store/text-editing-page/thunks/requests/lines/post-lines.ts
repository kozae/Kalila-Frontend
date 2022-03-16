import { RootState } from '../../../../config';
import { ILine, IToken } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { groupBy, omit } from 'lodash';
import ObjectID from 'bson-objectid';
import { getParams, PageParams } from '../helpers';
import axios from 'axios';

export async function postLines(state: RootState) {
  if (
    state.textEditingPageState.postLines.length === 0 &&
    Object.entries(state.textEditingPageState.moveLines).length === 0
  ) {
    return { Lines: [], Ids: [] };
  }

  const CreatedLines: Array<ILine & { ElementId: string }> = [];
  state.textEditingPageState.postLines.forEach((id) => {
    CreatedLines.push(
      cleanObject({
        ...omit(state.lines.entities[id], '_id'),
        Id: ObjectID().toString(),
        Tokens: [],
      }) as ILine & { ElementId: string }
    );
  });

  const MovedLines: Array<ILine & { ElementId: string }> = [];
  Object.entries(state.textEditingPageState.moveLines).forEach(
    ([lineId, elementId]) => {
      const tokens = Object.values(state.tokens.entities).filter(
        (t) => t && t.LineId === lineId
      ) as IToken[];
      MovedLines.push({
        ...state.lines.entities[lineId],
        Id: lineId,
        Tokens: tokens,
        ElementId: elementId,
      } as ILine & { ElementId: string });
    }
  );

  const params = getParams(state);
  for (const [ElementId, ElementLines] of Object.entries(
    groupBy([...CreatedLines, ...MovedLines], (l) => l.ElementId)
  )) {
    await postLinesHTTP(
      {
        ElementId,
        Lines: ElementLines.map((l) => omit(l, 'ElementId')),
      },
      params
    );
  }

  return { Lines: CreatedLines, Ids: state.textEditingPageState.postLines };
}

async function postLinesHTTP(
  data: {
    ElementId: string;
    Lines: ILine[];
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
