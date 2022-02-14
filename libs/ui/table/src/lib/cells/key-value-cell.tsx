import Typography from '@mui/material/Typography';
import { CellContainer } from './cell-container';
import React from 'react';
import { stringHasValue } from '@frontend/util';

export const KeyValueCell = ({ value, odd }: any) => (
  <CellContainer>
    <Typography sx={{ color: 'inherit' }} variant="h3">
      {stringHasValue(value) ? value : ''}
    </Typography>
  </CellContainer>
);
