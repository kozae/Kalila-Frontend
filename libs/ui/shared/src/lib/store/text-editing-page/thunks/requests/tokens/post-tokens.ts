import { RootState } from '@frontend/shared-ui';
import { getParams, PageParams } from '../helpers';
import { IMorphology, IToken } from '@frontend/domain';
import axios from 'axios';
import { omit } from 'lodash';

export async function postTokens(state: RootState) {
  if (state.textEditingPageState.postTokens.length === 0) {
    return;
  }
  const data: {
    ElementId: string;
    LineId: string;
    Tokens: Array<IToken>;
  }[] = [];

  state.textEditingPageState.postTokens.forEach((lineId) => {
    const line = state.lines.entities[lineId];
    const tokens = Object.values(state.tokens.entities).filter(
      (t) => t && t.LineId === lineId
    ) as (IToken & { LineId: string })[];
    data.push({
      ElementId: line?.ElementId as string,
      LineId: lineId,
      Tokens: tokens.map((t) => ({
        ...omit(t, 'LineId'),
        Id: t.Id as string,
        Morphology: state.morphologies.entities[`${t.LineId}_${t.OrderInLine}`]
          ? (omit(state.morphologies.entities[`${t.LineId}_${t.OrderInLine}`], [
              'LineId',
              'TokenOrder',
            ]) as IMorphology)
          : undefined,
      })),
    });
  });
  const params = getParams(state);
  await postTokensHTTP(data, params);
}

async function postTokensHTTP(
  data: {
    ElementId: string;
    LineId: string;
    Tokens: Array<IToken>;
  }[],
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.post('/server/api/v1/PageTranscription/Tokens', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
