import { ILine, IUnitSummary } from '@frontend/domain';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { hexToRgba } from '@frontend/util';
import { darken } from '@mui/material';
import { selectTokensOfLine, useAppSelector } from '@frontend/shared-ui';
import { useCallback } from 'react';
import { getLineItems } from './helpers';
import { Token } from './token';
import { UnitFromPreviousPage } from './unit-from-previous-page';
import { MovableUnitStart } from "../draggables/movable-unit-start";
import { MovableUnitEnd } from "../draggables/movable-unit-end";

export interface ILineProps {
  d: Omit<ILine, 'Tokens'> & { ElementId: string };
  units: IUnitSummary[];
  currentPageNumber: number;
}

export const Line = ({ d, units, currentPageNumber }: ILineProps) => {
  const tokens = useAppSelector((state) => selectTokensOfLine(state, d.Id));
  const renderItems = useCallback(() => {
    const items = getLineItems(tokens, units, d.LineOrder, currentPageNumber);
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
        bgcolor: d.HighlightColor
          ? hexToRgba(d.HighlightColor, 0.1)
          : 'rgba(0,0,0, 0.2)',
        border: '3px solid',
        borderColor: d.HighlightColor ? darken(d.HighlightColor, 0.1) : 'black',
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
