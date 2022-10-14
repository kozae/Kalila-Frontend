import { RootState } from '@frontend/shared-ui';
import { getParams, PageParams } from '../helpers';
import { IToken } from '@frontend/domain';
import axios from 'axios';
import { omit } from 'lodash';

export async function postTokens(
  state: RootState,
  morphology: Record<string, string[]>
) {
  console.log({ morphology });
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
        Morphology: morphology[t.RawToken] ?? [],
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
  await axios.post(
    `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Tokens`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
