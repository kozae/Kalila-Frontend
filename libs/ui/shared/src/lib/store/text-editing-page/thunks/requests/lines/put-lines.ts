import { RootState } from '../../../../config';
import { ILine } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { omit } from 'lodash';
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
  const data: {
    ElementId: string;
    Line: Omit<ILine, 'Tokens' | '_id' | 'HighlightColor'> & {
      Id: string;
    };
  }[] = [];
  Lines.forEach((l) => {
    data.push({
      ElementId: l.ElementId,
      Line: omit(l, ['ElementId', 'HighlightColor']),
    });
  });

  await putLinesHTTP(data, params);
}

async function putLinesHTTP(
  data: {
    ElementId: string;
    Line: Omit<ILine, 'Tokens' | '_id' | 'HighlightColor'> & {
      Id: string;
    };
  }[],
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.put('/server/api/v1/PageTranscription/Lines', data, {
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
