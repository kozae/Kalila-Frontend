import Stack from '@mui/material/Stack';
import { selectBookUnitsWithFilter, useAppSelector } from '@frontend/shared-ui';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import { BookUnitTag } from './book-unit-tag';
import { useContext } from 'react';
import { BookUnitPanelContext } from './book-unit-panel.context';

export const BookUnitContainer = () => {
  const { filter } = useContext(BookUnitPanelContext);
  const units = useAppSelector((state) =>
    selectBookUnitsWithFilter(state, filter)
  );
  return units.length === 0 ? (
    <Box>
      <Alert sx={{ p: '1rem', mt: '2rem' }} severity="info">
        <Typography variant="h5">This chapter has no units </Typography>
      </Alert>
    </Box>
  ) : (
    <Stack width="100%" direction="row" flexWrap="wrap" justifyContent="center">
      {units.map((d) => (
        <BookUnitTag key={d.Id} d={d} />
      ))}
    </Stack>
  );
};
