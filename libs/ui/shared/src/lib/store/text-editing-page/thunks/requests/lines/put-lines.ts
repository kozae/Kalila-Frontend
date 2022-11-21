import { RootState } from '../../../../config';
import { ILine } from '@frontend/domain';
import { cleanObject } from '@frontend/util';
import { omit } from 'lodash';
import { getParams, PageParams } from '../helpers';
import { ApiClient } from '../../../../../util';

export async function putLines(state: RootState) {
  if (state.textEditingPageState.putLines.length === 0) {
    return;
  }
  const Lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
  state.textEditingPageState.putLines.forEach((id) => {
    Lines.push(
      cleanObject({
        ...state.lines.entities[id],
        Id: id,
      }) as Omit<ILine, 'Tokens'> & { ElementId: string }
    );
  });
  const params = getParams(state);
  const data: {
    ElementId: string;
    Line: Omit<ILine, 'Tokens' | 'HighlightColor'> & {
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
    Line: Omit<ILine, 'Tokens' | 'HighlightColor'>;
  }[],
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().put(
    `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Lines`,
    data,
    {
      params: { Id: pageId, ManuscriptId: manuscriptId },
      headers: {},
    }
  );
}
