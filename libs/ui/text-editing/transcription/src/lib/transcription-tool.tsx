import { KalilaEditor } from './editor';
import { useCallback } from 'react';
import {
  selectAllLines,
  selectAllTextElements,
  selectAllTokens,
  selectTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { ILine, IToken } from '@frontend/domain';
import { orderBy } from 'lodash';
import { ViewTranscription } from './view-transcription';

export const TranscriptionTool = () => {
  const mode = useAppSelector(selectTextEditingToolMode);
  const dispatch = useAppDispatch();
  const textElements = useAppSelector(selectAllTextElements);
  const mainBodyElements = textElements.filter((el) =>
    el.Position.startsWith('main')
  );
  const otherElements = textElements.filter(
    (el) => !el.Position.startsWith('main')
  );

  const tokens = useAppSelector(selectAllTokens);
  const tokenToLineIdMap = tokens.reduce((acc: Record<string, IToken[]>, t) => {
    const { LineId, ...token } = t;
    if (acc[LineId]) {
      acc[LineId].push(token);
    } else {
      acc[LineId] = [token];
    }
    return acc;
  }, {});
  const allLines = useAppSelector(selectAllLines);
  const linesToElementMap = allLines.reduce(
    (
      acc: Record<string, (Omit<ILine, 'Tokens'> & { ElementId: string })[]>,
      l
    ) => {
      if (acc[l.ElementId]) {
        acc[l.ElementId].push(l);
      } else {
        acc[l.ElementId] = [l];
      }
      return acc;
    },
    {}
  );
  const getLines = useCallback(() => {
    const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
    if (mode === 'main-body') {
      mainBodyElements.forEach((el) => {
        lines.push(...linesToElementMap[el.Id]);
      });
    } else if (mode == 'secondary-text') {
      otherElements.forEach((el) => {
        lines.push(...linesToElementMap[el.Id]);
      });
    }

    return orderBy(lines, 'LineOrder');
  }, [mode]);

  return mode !== 'default' ? (
    <KalilaEditor
      key={mode}
      tokenToLineIdMap={tokenToLineIdMap}
      lines={getLines()}
    />
  ) : (
    <ViewTranscription
      mainBodyElements={mainBodyElements}
      otherElements={otherElements}
      linesToElementMap={linesToElementMap}
    />
  );
};
