import {
  selectAllLines,
  selectAllTextElements,
  selectAllUnitSummaries,
  selectCurrentPageNumber,
  useAppSelector,
} from '@frontend/shared-ui';
import { ILine, IUnitSummary } from '@frontend/domain';
import { orderBy, sortBy } from 'lodash';
import Stack from '@mui/material/Stack';
import { Line } from './line';
import { orderUnits } from '@frontend/util';

export const TextComponent = () => {
  const textElements = useAppSelector(selectAllTextElements);
  const units = orderUnits(useAppSelector(selectAllUnitSummaries));
  const mainBodyElements = textElements.filter((el) =>
    el.Position.startsWith('main')
  );
  const allLines = useAppSelector(selectAllLines);
  const currentPageNumber = useAppSelector(selectCurrentPageNumber);
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
  const getLines = () => {
    const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
    mainBodyElements.forEach((el) => {
      lines.push(...linesToElementMap[el.Id]);
    });
    return orderBy(lines, 'LineOrder');
  };

  return (
    <Stack sx={{ mt: '5px', width: '100%' }}>
      {getLines().map((l) => (
        <Line
          currentPageNumber={currentPageNumber}
          d={l}
          units={units}
          key={l.Id}
        />
      ))}
    </Stack>
  );
};
