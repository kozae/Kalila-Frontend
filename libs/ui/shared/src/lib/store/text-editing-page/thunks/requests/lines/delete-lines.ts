import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { groupBy } from 'lodash';
import { ApiClient } from '../../../../../util';

export async function deleteLines(state: RootState) {
  if (
    state.textEditingPageState.deleteLines.length === 0 &&
    Object.entries(state.textEditingPageState.moveLines).length === 0
  ) {
    return;
  }
  const lines: { Id: string; ElementId: string }[] = [];
  state.textEditingPageState.deleteLines.forEach((id) => {
    const line = state.textEditingPageState.linesBeforeChanges.find(
      (l) => l.Id === id
    );
    if (line) {
      lines.push({
        Id: id,
        ElementId: line.ElementId as string,
      });
    }
  });

  Object.keys(state.textEditingPageState.moveLines).forEach((lineId) => {
    const line = state.textEditingPageState.linesBeforeChanges.find(
      (l) => l.Id === lineId
    );
    if (line) {
      lines.push({
        Id: lineId,
        ElementId: line.ElementId,
      });
    }
  });

  const params = getParams(state);
  for (const [ElementId, ElementLines] of Object.entries(
    groupBy(lines, (l) => l.ElementId)
  )) {
    await deleteLinesHTTP(
      {
        ElementId,
        Lines: ElementLines.map((l) => l.Id),
      },
      params
    );
  }
}

async function deleteLinesHTTP(
  data: {
    ElementId: string;
    Lines: string[];
  },
  { manuscriptId, pageId }: PageParams
) {
  await ApiClient().request({
    url: `${process.env['NEXT_PUBLIC_API_URL']}PageTranscription/Lines`,
    method: 'DELETE',
    data,
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {},
  });
}
