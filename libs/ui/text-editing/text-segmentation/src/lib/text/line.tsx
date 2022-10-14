import { ILine, IUnitSummary } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  selectNearestOpenUnit,
  selectTokensOfLine,
  useAppSelector,
} from '@frontend/shared-ui';
import { useCallback } from 'react';
import { getLineItems } from './helpers';
import { Token } from './token';
import { UnitFromPreviousPage } from './unit-from-previous-page';
import { MovableUnitStart } from '../draggables/movable-unit-start';
import { MovableUnitEnd } from '../draggables/movable-unit-end';

export interface ILineProps {
  d: Omit<ILine, 'Tokens'> & { ElementId: string };
  i: number;
  units: IUnitSummary[];
  currentPageNumber: number;
}

export const Line = ({ d, units, currentPageNumber, i }: ILineProps) => {
  const tokens = useAppSelector((state) => selectTokensOfLine(state, d.Id));
  const nearestOpenUnit = useAppSelector(selectNearestOpenUnit);
  const renderItems = useCallback(() => {
    const items = getLineItems(
      tokens,
      units,
      d.LineOrder,
      currentPageNumber,
      nearestOpenUnit
    );
    return items.map((item) => {
      switch (item.type) {
        case 'start':
          return <MovableUnitStart d={item} key={item.Id} />;
        case 'end':
          return <MovableUnitEnd d={item} key={`${item.Id}_End`} />;
        case 'from previous':
          return <UnitFromPreviousPage d={item} key={item.Id} />;
        default:
          return (
            <Token
              d={item}
              currentPageNumber={currentPageNumber}
              lineOrder={d.LineOrder}
              key={`${item.Id}_${item.type}`}
            />
          );
      }
    });
  }, [tokens, units, d.LineOrder]);

  return (
    <Stack
      sx={{
        width: '100%',
        mt: '10px',
        bgcolor: i % 2 === 0 ? 'white' : '#F1F1F1',
        borderRadius: '5px',
      }}
      alignItems="center"
      direction="row-reverse"
      flexWrap="wrap"
    >
      <Box>
        <Typography sx={{ p: '5px' }} variant="h1">
          {d.LineOrder + 1}
        </Typography>
      </Box>
      {renderItems()}
    </Stack>
  );
};
