import Stack from '@mui/material/Stack';
import { KalilaEditor } from './editor';
import { useCallback, useState } from 'react';
import {
  selectAllLines,
  selectAllTextElements,
  selectAllTokens,
  useAppSelector,
} from '@frontend/shared-ui';
import { ILine, IToken } from '@frontend/domain';
import { orderBy } from 'lodash';
import { TranscriptionToolContext } from './transcription-tool.context';

export const TranscriptionTool = () => {
  const [mode, setMode] = useState<'main' | 'other'>('main');
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
    if (mode === 'main') {
      mainBodyElements.forEach((el) => {
        lines.push(...linesToElementMap[el.Id]);
      });
    } else {
      otherElements.forEach((el) => {
        lines.push(...linesToElementMap[el.Id]);
      });
    }

    return orderBy(lines, 'LineOrder');
  }, [mode]);
  return (
    <TranscriptionToolContext.Provider value={{ mode, setMode }}>
      <KalilaEditor tokenToLineIdMap={tokenToLineIdMap} lines={getLines()} />
    </TranscriptionToolContext.Provider>
  );
};
