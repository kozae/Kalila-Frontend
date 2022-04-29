import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { EditionCellData, EditionStore } from '../store';
import { range } from 'lodash';
import { useContext, useMemo } from 'react';
import {
  FONT_FAMILIES,
  WIDTH_OPTIONS,
  ViewEditionContext,
  FONT_SIZES,
} from './view-edition-context';

export interface IEditionCellProps {
  data: EditionCellData;
  bgcolor: 'white' | '#F1F1F1';
}

export const EditionCell = ({ data, bgcolor }: IEditionCellProps) => {
  const count = data.get_token_count();
  const unit_idx = data.get_unit_idx();
  const manuscript_unit_order = data.get_unit_order();

  const { size, font } = useContext(ViewEditionContext);

  const style = {
    width: useMemo(() => `${WIDTH_OPTIONS[size]}px`, [size]),
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
        {manuscript_unit_order !== unit_idx && (
          <Typography
            key={'order'}
            fontSize="1.3rem"
            component="p"
            fontWeight="600"
            sx={{
              p: '3px',
              bgcolor: 'secondary.light',
              color: 'white',
              borderRadius: '5px',
            }}
          >
            {data.get_unit_order()}
          </Typography>
        )}

        {unit_idx !== undefined &&
          range(count).map((index) => (
            <Typography
              key={index}
              fontSize={FONT_SIZES[size]}
              fontFamily={FONT_FAMILIES[font]}
              component="p"
              sx={{
                p: '3px',
              }}
            >
              {data.get_token(index)}
            </Typography>
          ))}

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </Box>
  );
};
