import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import { BookUnitTag } from './book-unit-tag';
import { useData } from '../contexts/data.context';
import { InsertableEndTag } from './draggables';

export const BookUnitContainer = () => {
  const { units } = useData();

  return units.length === 0 ? (
    <Box>
      <Alert sx={{ p: '1rem', mt: '2rem' }} severity="info">
        <Typography variant="h5">This chapter has no units </Typography>
      </Alert>
    </Box>
  ) : (
    <Stack width="100%" direction="row" flexWrap="wrap" justifyContent="center">
      <InsertableEndTag />
      {units.map((d) => (
        <BookUnitTag key={d.Id} d={d} />
      ))}
    </Stack>
  );
};
