import { RootState } from '../../../../config';
import { ILine, IToken } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { groupBy, omit } from 'lodash';
import ObjectID from 'bson-objectid';
import { getParams, PageParams } from '../helpers';
import axios from 'axios';

type BackEndLine = Omit<ILine, 'Tokens' | '_id'> & {
  Id: string;
  Tokens: Array<Omit<IToken, '_id'> & { Id: string }>;
};

export async function postLines(state: RootState) {
  if (
    state.textEditingPageState.postLines.length === 0 &&
    Object.entries(state.textEditingPageState.moveLines).length === 0
  ) {
    return { Lines: [], Ids: [] };
  }

  const CreatedLines: Array<BackEndLine & { ElementId: string }> = [];
  state.textEditingPageState.postLines.forEach((id) => {
    CreatedLines.push(
      cleanObject({
        ...omit(state.lines.entities[id], '_id'),
        Id: ObjectID().toString(),
        Tokens: [],
      }) as BackEndLine & { ElementId: string }
    );
  });

  const MovedLines: Array<BackEndLine & { ElementId: string }> = [];
  Object.entries(state.textEditingPageState.moveLines).forEach(
    ([lineId, elementId]) => {
      const tokens = Object.values(state.tokens.entities).filter(
        (t) => t && t.LineId === lineId
      ) as IToken[];
      MovedLines.push({
        ...omit(state.lines.entities[lineId], '_id'),
        Id: lineId,
        Tokens: tokens.map((t) => ({ ...omit(t, '_id'), Id: t._id })),
        ElementId: elementId,
      });
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
    Lines: BackEndLine[];
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
