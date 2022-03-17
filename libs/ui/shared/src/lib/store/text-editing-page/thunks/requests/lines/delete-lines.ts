import axios from 'axios';
import { RootState } from '../../../../config';
import { getParams, PageParams } from '../helpers';
import { groupBy } from 'lodash';

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
  { accessToken, manuscriptId, pageId }: PageParams
) {
  await axios.request({
    url: '/server/api/v1/PageTranscription/Lines',
    method: 'DELETE',
    data,
    params: { Id: pageId, ManuscriptId: manuscriptId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
