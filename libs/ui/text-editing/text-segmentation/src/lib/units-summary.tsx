import {
  kalilaTheme,
  selectAllUnitSummaries,
  useAppSelector,
} from '@frontend/shared-ui';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { TextSegmentationContext } from './context';

export const UnitsSummary = () => {
  const units = useAppSelector(selectAllUnitSummaries);
  const { hoveredUnit } = useContext(TextSegmentationContext);
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        width: '100%',
        zIndex: 10,
        boxShadow: kalilaTheme.shadows[4],
        pb: '5px',
        height: '3rem',
      }}
      justifyContent="center"
      alignItems="center"
    >
      {units.length === 0 && (
        <Typography p="5px" variant="h4">
          No units assigned
        </Typography>
      )}
      {hoveredUnit === undefined && (
        <Typography variant="h4">
          [ hover on a unit tag to reveal its name ]
        </Typography>
      )}
      {hoveredUnit && (
        <Typography key={hoveredUnit} p="5px" variant="h2">
          {hoveredUnit}
        </Typography>
      )}
    </Stack>
  );
};
