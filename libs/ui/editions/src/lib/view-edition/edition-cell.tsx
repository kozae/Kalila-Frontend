import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EditionCellData, EditionStore } from '../store';
import { range } from 'lodash';

export interface IEditionCellProps {
  data: EditionCellData;
  width: string;
  bgcolor: 'white' | '#F1F1F1';
  store: EditionStore;
}

export const EditionCell = ({
  data,
  width,
  bgcolor,
  store,
}: IEditionCellProps) => {
  const count = data.get_token_count();
  const unit_idx = data.get_unit_idx();
  const manuscript_idx = data.get_manuscript_idx();
  const style = {
    width,
    p: '5px',
    minHeight: '50px',
    bgcolor,
    borderRadius: '5px',
  };
  if (count === 0) {
    return (
      <Stack sx={style} alignItems="center" justifyContent="center">
        <Typography align="right" fontSize="1rem" variant="body2">
          [ absent ]
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={style}>
      <Stack
        alignItems="flex-start"
        justifyContent="space-evenly"
        direction="row-reverse"
        flexWrap="wrap"
      >
        {range(count).map((index) => (
          <Typography
            key={index}
            fontSize="1.3rem"
            variant="body2"
            component="p"
            sx={{ p: '3px' }}
          >
            {store.get_token(unit_idx, manuscript_idx, index)}
          </Typography>
        ))}

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </Box>
  );
};
