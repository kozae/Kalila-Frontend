import Typography from '@mui/material/Typography';
import React from 'react';
import { CellContainer } from './cell-container';
import { stringHasValue } from '@frontend/util';

export const GenericCell = ({ value }: any) => (
  <CellContainer>
    <Typography
      maxWidth="100%"
      maxHeight="100%"
      textOverflow="ellipsis"
      variant="body1"
      align="center"
      textAlign="center"
    >
      {value !== undefined && stringHasValue(String(value))
        ? String(value)
        : ''}
    </Typography>
  </CellContainer>
);
